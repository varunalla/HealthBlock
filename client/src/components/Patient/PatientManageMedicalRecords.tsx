import React, { FunctionComponent, useContext, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { HealthContext } from '../../providers/HealthProvider';
import AWS from 'aws-sdk';

interface docData {
  id: number;
  fullname: string;
  date: Date;
  email: string;
}
const cards: { [key: number]: docData } = {
  0: {
    id: 1,
    fullname: 'John Doe',
    date: new Date('2023-04-12'),
    email: 'johndoe@example.com',
  },
  1: {
    id: 2,
    fullname: 'Jane Doe',
    date: new Date('2023-03-17'),
    email: 'janedoe@example.com',
  },
  2: {
    id: 3,
    fullname: 'Bob Smith',
    date: new Date('2023-02-22'),
    email: 'bobsmith@example.com',
  },
  3: {
    id: 4,
    fullname: 'Alice Smith',
    date: new Date('2023-03-22'),
    email: 'dharahasini.gangalapudi@gmail.com',
  },
  4: {
    id: 5,
    fullname: 'Tom Brown',
    date: new Date('2023-01-22'),
    email: 'tombrown@example.com',
  },
  5: {
    id: 6,
    fullname: 'Sara Kim',
    date: new Date('2023-04-21'),
    email: 'sarakhim@example.com',
  },
  6: {
    id: 7,
    fullname: 'Mary Lee',
    date: new Date('2023-02-26'),
    email: 'marylee@example.com',
  },
  7: {
    id: 8,
    fullname: 'David Kim',
    date: new Date('2023-04-12'),
    email: 'davidkim@example.com',
  },
  8: {
    id: 9,
    fullname: 'Rishi',
    date: new Date('2023-03-19'),
    email: 'hasinireddy765@gmail.com',
  },
  9: {
    id: 10,
    fullname: 'Mike Johnson',
    date: new Date('2023-03-14'),
    email: 'mikejohnson@example.com',
  },
  10: {
    id: 11,
    fullname: 'Lisa Johnson',
    date: new Date('2023-04-06'),
    email: 'lisajohnson@example.com',
  },
  11: {
    id: 12,
    fullname: 'Steve Lee',
    date: new Date('2022-04-09'),
    email: 'stevelee@example.com',
  },
  12: {
    id: 13,
    fullname: 'Kate Lee',
    date: new Date('2022-02-12'),
    email: 'katelee@example.com',
  },
  13: {
    id: 14,
    fullname: 'Alex Brown',
    date: new Date('2023-02-10'),
    email: 'alexbrown@example.com',
  },
  14: {
    id: 15,
    fullname: 'Emily Brown',
    date: new Date('2023-02-22'),
    email: 'emilybrown@example.com',
  },
};
const PatientManageMedicalRecords: FunctionComponent<{}> = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOption, setFilterOption] = useState<string>('all');
  const [showDeclinePopup, setShowDeclinePopup] = useState(false);
  const [selectedFile, setSelectedFile] = useState<undefined | File>(undefined);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [showAcceptPopup, setShowAcceptPopup] = useState(false);
  const cardsPerPage = 4;

  const ses = new AWS.SES({
    apiVersion: '2010-12-01',
    region: 'us-east-1',
    accessKeyId: process.env['ACCESS_KEY_ID'],
    secretAccessKey: process.env['SECRET_ACCESS_KEY'],
  });

  function sendAcceptEmail(to: string) {
    const subject = 'Medical Records Request Accepted';
    const body =
      'Your medical records request have been accepted and medical records are uploaded by patient.';
    sendEmail(to, subject, body);
  }
  function sendDeclineEmail(to: string) {
    const subject = 'Medical Records Request Declined';
    const body = 'Your medical records request have been declined by your patient.';
    sendEmail(to, subject, body);
  }

  function sendEmail(to: string, subject: string, body: string) {
    const params = {
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: body,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
      Source: 'dharahasini.gangalapudi@sjsu.edu',
    };

    ses.getIdentityVerificationAttributes({ Identities: [to] }, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        const verificationAttributes = data.VerificationAttributes[to];
        if (verificationAttributes && verificationAttributes.VerificationStatus === 'Success') {
          // Email identity is verified, send the email
          ses.sendEmail(params, (err, data) => {
            if (err) {
              console.log(err);
            } else {
              console.log('Email sent:', data);
            }
          });
        } else {
          // Email identity is not verified, verify the email identity
          ses.verifyEmailIdentity({ EmailAddress: to }, (err, data) => {
            if (err) {
              console.log(err);
            } else {
              console.log(`Email identity verification initiated for ${to}.`);
              // Wait for the email identity to be verified before sending the email
              const intervalId = setInterval(() => {
                ses.getIdentityVerificationAttributes({ Identities: [to] }, (err, data) => {
                  if (err) {
                    console.log(err);
                  } else {
                    const verificationAttributes = data.VerificationAttributes[to];
                    if (
                      verificationAttributes &&
                      verificationAttributes.VerificationStatus === 'Success'
                    ) {
                      clearInterval(intervalId);
                      ses.sendEmail(params, (err, data) => {
                        if (err) {
                          console.log(err);
                        } else {
                          console.log('Email sent:', data);
                        }
                      });
                    }
                  }
                });
              }, 5000);
            }
          });
        }
      }
    });
  }

  const handleAccept = (email: string) => {
    sendAcceptEmail(email);
  };
  const handleDecline = (email: string) => {
    sendDeclineEmail(email);
  };
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files !== null) {
      setSelectedFile(event.target.files[0]);
    }
  };
  const toggleAcceptPopup = () => {
    setShowAcceptPopup(!showAcceptPopup);
  };

  const toggleDeclinePopup = async () => {
    setShowDeclinePopup(!showDeclinePopup);
  };

  // Handle pagination click
  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Function to handle filter option change
  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterOption(event.target.value);
    setCurrentPage(1); // Reset current page to 1 when filter option is changed
  };

  const filteredCards = Object.values(cards).filter((card: docData) => {
    if (filterOption === 'all') {
      return true;
    } else if (filterOption === 'upcoming') {
      return card.date >= new Date();
    } else if (filterOption === 'past') {
      return card.date < new Date();
    }
    return false;
  });

  // Calculate index of first and last card for the current page
  const indexOfFirstCard = (currentPage - 1) * cardsPerPage;
  const indexOfLastCard = Math.min(indexOfFirstCard + cardsPerPage, filteredCards.length) - 1;

  // Get subset of cards for the current page
  const currentCards = Object.values(filteredCards)
    .slice(indexOfFirstCard, indexOfLastCard + 1)
    .map((card: docData) => ({
      id: card.id,
      fullname: card.fullname,
      date: card.date,
      email: card.email,
    }));

  return (
    <div>
      <div className='flex flex-col  px-4 lg:px-8 '>
        <div className='bg-gray-100 py-4 px-4 flex items-center justify-between'>
          <h1 className='text-2xl font-bold'>Share Medical Records</h1>
          <div className='relative flex items-center'>
            <label htmlFor='date' className='mr-2 text-sm font-medium'>
              Showing:
            </label>
            <select
              className='block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline'
              value={filterOption}
              onChange={handleFilterChange}
            >
              <option value='all'>All Appointments</option>
              <option value='upcoming'>Upcoming Appointments</option>
              <option value='past'>Past Appointments</option>
            </select>
            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
              <svg
                className='fill-current h-4 w-4'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
              >
                <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
              </svg>
            </div>
          </div>
        </div>
        <div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 mt-8'>
          <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
            <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                    >
                      Name
                    </th>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                    >
                      Date
                    </th>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                    >
                      Email ID
                    </th>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                    ></th>
                  </tr>
                </thead>

                {currentCards.map((card) => (
                  <tr key={card.id}>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>{card.fullname}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>{card.date.toLocaleDateString()}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>{card.email}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>
                        <button
                          id='request-btn'
                          className='bg-blue-500 text-white font-bold rounded-md px-4 py-2 ml-2'
                          onClick={toggleAcceptPopup}
                        >
                          Accept
                        </button>
                        <button
                          className='bg-blue-500 text-white font-bold rounded-md px-4 py-2 ml-2'
                          onClick={toggleDeclinePopup}
                        >
                          Decline
                        </button>
                      </div>
                      {showDeclinePopup && (
                        <div className='fixed z-10 inset-0 overflow-y-auto'>
                          <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
                            <div className='fixed inset-0 transition-opacity'>
                              <div className='absolute inset-0 bg-gray-500 opacity-30'></div>
                            </div>

                            <span
                              className='hidden sm:inline-block sm:align-middle sm:h-screen'
                              aria-hidden='true'
                            >
                              &#8203;
                            </span>

                            <div className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'>
                              <div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
                                <div className='sm:flex sm:items-start'>
                                  <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
                                    <h3
                                      className='text-lg leading-6 font-medium text-gray-900'
                                      id='modal-title'
                                    >
                                      Attention
                                      <span
                                        className='text-red-500'
                                        aria-label='Warning'
                                        role='img'
                                      >
                                        ⚠️
                                      </span>
                                    </h3>
                                    <div className='mt-2'>
                                      <p className='text-sm leading-5 text-gray-500'>
                                        You are declining the request to upload your medical records
                                        to Doctor{' '}
                                        <span style={{ fontWeight: 'bold', color: 'blue' }}>
                                          {card.fullname}
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
                                <span className='flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto'>
                                  <div className='flex justify-center'>
                                    <button
                                      id='decline-confirm-btn'
                                      type='button'
                                      className='inline-flex justify-center w-full sm:w-auto rounded-md border border-transparent px-4 py-2 bg-blue-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5'
                                      onClick={() => {
                                        handleDecline(card.email);
                                      }}
                                    >
                                      Confirm
                                    </button>
                                    <button
                                      type='button'
                                      className='inline-flex justify-center w-full sm:w-auto rounded-md border border-transparent px-4 py-2 bg-blue-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5 mt-3 sm:mt-0 sm:ml-3'
                                      onClick={toggleDeclinePopup}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {showAcceptPopup && (
                        <div className='fixed z-10 inset-0 overflow-y-auto'>
                          <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
                            <div className='fixed inset-0 transition-opacity'>
                              <div className='absolute inset-0 bg-gray-500 opacity-30'></div>
                            </div>

                            <span
                              className='hidden sm:inline-block sm:align-middle sm:h-screen'
                              aria-hidden='true'
                            >
                              &#8203;
                            </span>

                            <div className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full max-h-80vh'>
                              <div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
                                <div className='sm:flex sm:items-start'>
                                  <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
                                    <h3
                                      className='text-lg leading-6 font-medium text-gray-900'
                                      id='modal-title'
                                    >
                                      Attention
                                      <span
                                        className='text-red-500'
                                        aria-label='Warning'
                                        role='img'
                                      >
                                        ⚠️
                                      </span>
                                    </h3>
                                    <div className='mt-2'>
                                      <p className='text-sm leading-5 text-gray-500'>
                                        You are accepting the request and uploading your medical
                                        records for Doctor{' '}
                                        <span style={{ fontWeight: 'bold', color: 'blue' }}>
                                          {card.fullname}
                                        </span>
                                      </p>
                                      <div className='mt-2'>
                                        <label htmlFor='file-upload' className='cursor-pointer'>
                                          <p
                                            className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow inline-block'
                                            style={{ width: 'auto' }}
                                          >
                                            Browse
                                          </p>
                                        </label>
                                        {selectedFile && (
                                          <span className='text-sm leading-5 text-gray-500 ml-2'>
                                            {selectedFile.name}
                                          </span>
                                        )}
                                        <input
                                          id='file-upload'
                                          name='file-upload'
                                          type='file'
                                          accept='.pdf,.doc,.docx'
                                          className='sr-only'
                                          onChange={handleFileSelect}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
                                <span className='flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto'>
                                  <div className='flex justify-center'>
                                    <button
                                      id='accept-confirm-btn'
                                      type='button'
                                      className='inline-flex justify-center w-full sm:w-auto rounded-md border border-transparent px-4 py-2 bg-blue-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5'
                                      onClick={() => {
                                        toggleAcceptPopup();
                                        handleAccept(card.email);
                                      }}
                                    >
                                      Confirm
                                    </button>
                                    <button
                                      type='button'
                                      className='inline-flex justify-center w-full sm:w-auto rounded-md border border-transparent px-4 py-2 bg-blue-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5 mt-3 sm:mt-0 sm:ml-3'
                                      onClick={toggleAcceptPopup}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </table>
            </div>
          </div>
          <div className='flex justify-center items-center'>
            {Object.keys(filteredCards).length > cardsPerPage && (
              <ReactPaginate
                previousLabel={
                  <button className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l inline-flex'>
                    Prev
                  </button>
                }
                nextLabel={
                  <button className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r inline-flex'>
                    Next
                  </button>
                }
                breakLabel={'...'}
                pageCount={Math.ceil(Object.keys(filteredCards).length / cardsPerPage)}
                pageRangeDisplayed={2}
                marginPagesDisplayed={1}
                pageClassName={'mx-1'}
                containerClassName={'flex'}
                activeClassName={
                  'inline-block border border-blue-500 rounded py-1 px-3 bg-blue-500 text-white'
                }
                onPageChange={({ selected }: { selected: number }) => handlePageClick(selected + 1)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default PatientManageMedicalRecords;
