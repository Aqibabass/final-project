import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AI_PROMPT, SelectBudgetOptions, SelectTravelsList } from '@/constants/options';
import { chatSession } from '@/service/AIModel';
import React, { useEffect, useState } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { toast } from 'sonner';
import { doc, setDoc } from 'firebase/firestore';
import { db } from "@/service/firebaseConfig";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';

function CreateTrip() {
    const [place, setPlace] = useState();
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigate("/login");
        }
    }, [navigate]);

    const handleInputChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const OnGenerateTrip = async () => {
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user) {
            navigate("/login");
            return;
        }

        if (!formData?.location || !formData?.budget || !formData?.traveller || !formData?.noOfDays) {
            toast("Please fill all details");
            return;
        }

        setLoading(true);
        const FINAL_PROMPT = AI_PROMPT
            .replace('{location}', formData?.location?.label)
            .replace('{totalDays}', formData?.noOfDays)
            .replace('{traveller}', formData?.traveller)
            .replace('{budget}', formData?.budget);

        try {
            const result = await chatSession.sendMessage(FINAL_PROMPT);
            SaveAiTrip(result?.response?.text());
        } catch (error) {
            console.error('AI Trip Generation failed:', error);
            toast("Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const SaveAiTrip = async (TripData) => {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user'));
        const docId = Date.now().toString();

        try {
            await setDoc(doc(db, "AITrips", docId), {
                userSelection: formData,
                tripData: JSON.parse(TripData),
                userEmail: user?.email,
                id: docId
            });
            navigate(`/view-trip/${docId}`);
        } catch (error) {
            console.error('Error saving trip:', error);
            toast("Failed to save trip. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className='mb-8 sm:px-10 md:px-16 lg:px-24 xl:px-32 px-5 mt-8'>
                <h2 className='font-bold text-3xl text-center sm:text-4xl'>
                    Tell us your travel preferences 🏖️🏕️
                </h2>
                <p className='mt-3 text-gray-500 text-xl text-center'>
                    Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.
                </p>

                <div className='mt-14 flex flex-col gap-10'>
                    <div className='flex flex-col sm:flex-row gap-5'>
                        <div className='flex-1'>
                            <h2 className='text-xl my-3 font-medium'>
                                What is your destination of choice?
                            </h2>
                            <GooglePlacesAutocomplete
                                apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
                                selectProps={{
                                    place,
                                    onChange: (v) => {
                                        setPlace(v);
                                        handleInputChange('location', v);
                                    }
                                }}
                            />
                        </div>
                        <div className='flex-1'>
                            <h2 className='text-xl my-3 font-medium'>
                                How many days are you planning for your trip?
                            </h2>
                            <Input
                                placeholder={'Ex.3'}
                                type="number"
                                onChange={(e) => handleInputChange('noOfDays', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className='mt-12'>
                    <h2 className='text-xl my-3 font-medium'>What is your Budget?</h2>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5'>
                        {SelectBudgetOptions.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => handleInputChange('budget', item.title)}
                                className={`p-4 border rounded-lg hover:shadow-lg ${formData?.budget === item.title && 'shadow-lg border-black'}`}
                            >
                                <h2 className='text-4xl'>{item.icon}</h2>
                                <h2 className='font-bold text-lg'>{item.title}</h2>
                                <h2 className='text-sm text-gray-500'>{item.desc}</h2>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='mt-12'>
                    <h2 className='text-xl my-3 font-medium'>Who do you plan to go with on your next adventure?</h2>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5'>
                        {SelectTravelsList.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => handleInputChange('traveller', item.people)}
                                className={`p-4 border rounded-lg hover:shadow-lg ${formData?.traveller === item.people && 'shadow-lg border-black'}`}
                            >
                                <h2 className='text-4xl'>{item.icon}</h2>
                                <h2 className='font-bold text-lg'>{item.title}</h2>
                                <h2 className='text-sm text-gray-500'>{item.desc}</h2>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className='my-16 flex justify-center'>
                <Button className='text-white' disabled={loading} onClick={OnGenerateTrip}>
                    {loading ? <AiOutlineLoading3Quarters className='h-7 w-7 animate-spin' /> : 'Generate Trip'}
                </Button>
            </div>
        </div>
    );
}

export default CreateTrip;
