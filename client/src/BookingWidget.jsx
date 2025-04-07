import axios from 'axios';
import { differenceInCalendarDays } from 'date-fns';
import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from './UserContext';

function BookingWidget({ place }) {
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [numberOfGuests, setNumberOfGuests] = useState(1);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [redirect, setRedirect] = useState('');
    const [emailNotification, setEmailNotification] = useState(true);
    const [smsNotification, setSmsNotification] = useState(true);
    const { user } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        if (user) {
            setName(user.name);
        }
    }, [user]);

    let numberOfNights = 0;
    if (checkIn && checkOut) {
        numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
    }

    // Function to validate Indian phone number
    const validateIndianPhoneNumber = (phone) => {
        const indianPhoneRegex = /^(?:\+91)?[6789]\d{9}$/;
        return indianPhoneRegex.test(phone);
    };

    const isFormValid = () => {
        if (!checkIn || !checkOut || numberOfGuests <= 0 || !name.trim() || !phone.trim()) {
            alert("Please fill all fields!");
            return false;
        }
        if (!validateIndianPhoneNumber(phone)) {
            alert("Please enter a valid Indian phone number!");
            return false;
        }
        return true;
    };

    const bookThisPlace = async () => {
        if (!isFormValid()) return;

        if (!user) {
            alert('Please login to book a place!');
            return;
        }

        setIsLoading(true);
        try {
            const amount = numberOfNights * place.price;
            const orderResponse = await axios.post(`${import.meta.env.VITE_BASE_URL}/create-razorpay-order`, {
                amount,
            });

            if (!orderResponse.data.id) {
                throw new Error('Failed to create Razorpay order');
            }

            const options = {
                key: import.meta.env.RAZORPAY_KEY_ID,
                amount: orderResponse.data.amount,
                currency: "INR",
                name: "TravelMate AI",
                description: `Booking for ${place.title} - ${numberOfNights} nights`,
                order_id: orderResponse.data.id,
                handler: async function (response) {
                    try {
                        const bookingData = {
                            checkIn,
                            checkOut,
                            numberOfGuests,
                            name,
                            phone,
                            place: place._id,
                            price: amount,
                            paymentId: response.razorpay_payment_id,
                            orderId: orderResponse.data.id,
                            signature: response.razorpay_signature,
                            emailNotification,
                            smsNotification,
                        };

                        const bookingResponse = await axios.post(
                            `${import.meta.env.VITE_BASE_URL}/bookings`,
                            bookingData,
                            { withCredentials: true }
                        );

                        if (bookingResponse.data._id) {
                            setRedirect(`/account/bookings/${bookingResponse.data._id}`);
                        } else {
                            throw new Error("Booking ID not received");
                        }
                    } catch (error) {
                        console.error("Booking error:", error);
                        alert(`Booking failed: ${error.response?.data?.error || error.message}`);
                    }
                    setIsLoading(false);
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                    contact: phone,
                },
                theme: {
                    color: "#0d9488",
                },
                modal: {
                    ondismiss: function () {
                        setIsLoading(false);
                        alert('Payment was cancelled');
                    },
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error('Payment setup failed:', error);
            alert(`Payment failed: ${error.response?.data?.error || error.message}`);
            setIsLoading(false);
        }
    };

    if (redirect) {
        return <Navigate to={redirect} />;
    }

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className='bg-white shadow p-4 rounded-2xl'>
            <div className='text-2xl text-center'>
                Price: ₹{place.price} / per night
            </div>

            <div className="border rounded-2xl items-center mt-4">
                <div className="flex flex-col">
                    <div className='mt-4 px-4'>
                        <label>Check in: </label>
                        <input
                            type="date"
                            value={checkIn}
                            onChange={ev => setCheckIn(ev.target.value)}
                            min={today}
                        />
                    </div>

                    <div className='mt-4 px-4'>
                        <label>Check out: </label>
                        <input
                            type="date"
                            value={checkOut}
                            onChange={ev => setCheckOut(ev.target.value)}
                            min={checkIn || today}
                        />
                    </div>
                    <div className='my-4 py-3 px-4 border-t'>
                        <label>Number of guests:</label>
                        <input
                            type="number"
                            value={numberOfGuests}
                            onChange={ev => setNumberOfGuests(Number(ev.target.value))}
                            min={1}
                        />
                    </div>
                </div>

                {checkIn && checkOut && (
                    <>
                        {numberOfNights > 0 && (
                            <div className='my-4 py-3 px-4 border-t'>
                                <label>Your Name:</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={ev => setName(ev.target.value)}
                                />

                                <label>Phone Number:</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={ev => setPhone(ev.target.value)}
                                />

                                <div className="my-4 py-3 px-4 border-t">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="emailNotif"
                                            checked={emailNotification}
                                            onChange={ev => setEmailNotification(ev.target.checked)}
                                        />
                                        <label htmlFor="emailNotif">Receive booking confirmation via Email</label>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <input
                                            type="checkbox"
                                            id="smsNotif"
                                            checked={smsNotification}
                                            onChange={ev => setSmsNotification(ev.target.checked)}
                                        />
                                        <label htmlFor="smsNotif">Receive booking confirmation via SMS</label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            <button 
            onClick={bookThisPlace} 
            className='primary mt-4'
            disabled={isLoading}
        >
            {isLoading ? 'Processing...' : (
                <>
                    Book this place
                    {numberOfNights > 0 && <span> ₹{numberOfNights * place.price}</span>}
                </>
            )}
        </button>
        </div>
    );
}

export default BookingWidget;
