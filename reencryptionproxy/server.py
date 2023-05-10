import base64
import random
from flask import Flask, request, jsonify
from umbral import Capsule, PublicKey, SecretKey, Signer, VerifiedCapsuleFrag, VerifiedKeyFrag, decrypt_original, encrypt, generate_kfrags, reencrypt, decrypt_reencrypted
from Crypto.Cipher import AES
#from Crypto.Random import get_random_bytes


app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'live'

def toBase64(data):
    return base64.b64encode(data).decode('utf-8')
def fromBase64(data):
    return base64.b64decode(data.encode('utf-8'))

@app.route('/keys',methods=['GET'])
def getKeys():
    alices_secret_key = SecretKey.random()
    alices_public_key = alices_secret_key.public_key()
    signing_key = SecretKey.random()
    dict={
        'public_key': toBase64(bytes(alices_public_key)),
        'private_key':toBase64(alices_secret_key.to_secret_bytes()),
        'signing_key':toBase64(signing_key.to_secret_bytes())
    }
    response = {'status': 'success','data':dict }
    return jsonify(response)
@app.route('/encrypt',methods=['POST'])
def encrypt_handler():
    # create aes key, encrypt it with umbral and send original key, umbral private & public key and also cipher and capsule
    # the caller will encrypt the file with plain aes key and save it to s3 with umbral cipher and  
    data = request.get_json()
    requestor_payload_enc_key = bytes(data['aesKey'],'utf-8')
    requestor_secret_key = SecretKey.random()
    if('private_key' in data):
        requestor_secret_key=SecretKey.from_bytes(fromBase64(data['private_key']))
    requestor_public_key = requestor_secret_key.public_key()
    if('public_key' in data):
        requestor_public_key=PublicKey.from_bytes(fromBase64(data['public_key']))
    signing_key = SecretKey.random()
    if('signing_key' in data):
        signing_key=SecretKey.from_bytes(fromBase64(data['signing_key']))
    capsule, ciphertext = encrypt(requestor_public_key, requestor_payload_enc_key)
    
    dict={
        'public_key': requestor_public_key,
        'public_key': toBase64(bytes(requestor_public_key)),
        'private_key':toBase64(requestor_secret_key.to_secret_bytes()),
        'capsule':toBase64(bytes(capsule)), 
        'ciphertext':toBase64(bytes(ciphertext)),
        'signing_key':toBase64(signing_key.to_secret_bytes())
    }
    #capsule_test=fromBase64(dict['capsule'])
    #print(bytes(capsule))
    #print(capsule_test)
    #print(dict['capsule'])
    response = {'status': 'success','data':dict }
    return jsonify(response)

@app.route('/reencrypt',methods=['POST'])
def reEncrypt():    
    data = request.get_json()
    capsule_text = fromBase64(data['capsule'])
    capsule=Capsule.from_bytes(capsule_text)
    owner_private_key= SecretKey.from_bytes(fromBase64(data['private_key']))
    owner_siging_key=SecretKey.from_bytes(fromBase64(data['signing_key']))
    requester_public_key=PublicKey.from_bytes(fromBase64(data['public_key']))
    alices_signer = Signer(owner_siging_key)
    kfrags = generate_kfrags(delegating_sk=owner_private_key,
                         receiving_pk=requester_public_key,
                         signer=alices_signer,
                         threshold=10,
                         shares=20)

    # Ursulas perform re-encryption
    # ------------------------------
    # Bob asks several Ursulas to re-encrypt the capsule so he can open it.
    # Each Ursula performs re-encryption on the capsule using the `kfrag`
    # provided by Alice, obtaining this way a "capsule fragment", or `cfrag`.
    # Let's mock a network or transport layer by sampling `threshold` random `kfrags`,
    # one for each required Ursula.

    kfrags = random.sample(kfrags,  # All kfrags from above
                        10)      # M - Threshold
    encoded_kfrags= [bytes(kfrag) for kfrag in kfrags]

    decoded_kfrags = [VerifiedKeyFrag.from_verified_bytes(kfrag) for kfrag in encoded_kfrags]
    # Bob collects the resulting `cfrags` from several Ursulas.
    # Bob must gather at least `threshold` `cfrags` in order to open the capsule.

    cfrags = list()  # Bob's cfrag collection
    result=[]
    for kfrag in decoded_kfrags:
        cfrag = reencrypt(capsule=capsule, kfrag=kfrag)
        cfrags.append(cfrag)  # Bob collects a cfrag
        result.append(toBase64(bytes(cfrag)))
    
    dict= {
        'cfrags':result
    }
    response = {'status': 'success','data': dict }
    return jsonify(response)


@app.route('/decryptReencrypt',methods=['POST'])
def deReEncrypt():    
    # create aes key, encrypt it with umbral and send original key, umbral private & public key and also cipher and capsule
    # the caller will encrypt the file with plain aes key and save it to s3 with umbral cipher and  
    data = request.get_json()
    requestor_private_key= SecretKey.from_bytes(fromBase64(data['private_key']))
    owner_public_key=PublicKey.from_bytes(fromBase64(data['public_key']))
    capsule_text = fromBase64(data['capsule'])
    capsule=Capsule.from_bytes(capsule_text)
    ciphertext = fromBase64(data['ciphertext']) 
    cfrags=[]
    for cfrag in data['cfrags']:
        cfrags.append(VerifiedCapsuleFrag.from_verified_bytes(fromBase64(cfrag)))
    cleartext = decrypt_reencrypted(receiving_sk=requestor_private_key,
                                    delegating_pk=owner_public_key,
                                    capsule=capsule,
                                    verified_cfrags=cfrags,
                                    ciphertext=ciphertext)
    response = {'status': 'success','data':  cleartext.decode('utf-8') }
    return jsonify(response)


@app.route('/decrypt', methods=['POST'])
def decryptHandler():
    data = request.get_json()
    
    # public key generated by the client using keys get endpoint
    capsule_text = fromBase64(data['capsule'])
    capsule=Capsule.from_bytes(capsule_text)
    ciphertext = fromBase64(data['ciphertext']) 
    alices_secret_key= SecretKey.from_bytes(fromBase64(data['private_key']))
    cleartext = decrypt_original(alices_secret_key, capsule, ciphertext)
    response = {'status': 'success','aesKey':cleartext.decode('utf-8')}
    return jsonify(response)


if __name__ == '__main__':
    app.run(host='0.0.0.0' , port=5001)
