import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AI_PROMPT, SelectBudgetOptions, SelectTravelsList } from '@/constants/options';
import { chatSession } from '@/service/AIModel';
import React, { useEffect, useState } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
} from "@/components/ui/dialog";
import { doc, setDoc } from 'firebase/firestore';
import { db } from "@/service/firebaseConfig";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/ui/custom/Footer';

function CreateTrip() {
    const [place, setPlace] = useState();
    const [formData, setFormData] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleInputChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        });
    };

    useEffect(() => {
        console.log(formData);
    }, [formData]);

    const login = useGoogleLogin({
        onSuccess: (codeResp) => {
            const accessToken = codeResp?.access_token;
            if (accessToken) {
                GetUserProfile(accessToken);
            }
        },
        onError: (error) => console.log(error),
    });

    const OnGenerateTrip = async () => {
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user) {
            setOpenDialog(true);
            return;
        }

        if (formData?.noOfDays > 5 && !formData?.location || !formData?.budget || !formData?.traveller) {
            toast("Please fill all details");
            setOpenDialog(false);
            return;
        }
        setLoading(true);
        const FINAL_PROMPT = AI_PROMPT
            .replace('{location}', formData?.location?.label)
            .replace('{totalDays}', formData?.noOfDays)
            .replace('{traveller}', formData?.traveller)
            .replace('{budget}', formData?.budget)
            .replace('{totalDays}', formData?.noOfDays);

        const result = await chatSession.sendMessage(FINAL_PROMPT);
        console.log(result?.response?.text());
        setLoading(false);
        SaveAiTrip(result?.response?.text());
    };

    const SaveAiTrip = async (TripData) => {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user'));
        const docId = Date.now().toString();

        await setDoc(doc(db, "AITrips", docId), {
            userSelection: formData,
            tripData: JSON.parse(TripData),
            userEmail: user?.email,
            id: docId
        });
        setLoading(false);
        navigate(`/view-trip/${docId}`);
    };

    const GetUserProfile = async (accessToken) => {
        try {
            const response = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            console.log('User Profile:', response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
            setOpenDialog(false); 
            OnGenerateTrip();  
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    return (
        <div>
            <div className='sm:px-10 md:px-16 lg:px-24 xl:px-32 px-5 mt-16'>
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
                    <h2 className='text-xl my-3 font-medium'>
                        What is your Budget?
                    </h2>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5'>
                        {SelectBudgetOptions.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => handleInputChange('budget', item.title)}
                                className={`p-4 border rounded-lg hover:shadow-lg 
                                    ${formData?.budget == item.title && 'shadow-lg border-black'}`}
                            >
                                <h2 className='text-4xl'>{item.icon}</h2>
                                <h2 className='font-bold text-lg'>{item.title}</h2>
                                <h2 className='text-sm text-gray-500'>{item.desc}</h2>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='mt-12'>
                    <h2 className='text-xl my-3 font-medium'>
                        Who do you plan to go with on your next adventure?
                    </h2>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5'>
                        {SelectTravelsList.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => handleInputChange('traveller', item.people)}
                                className={`p-4 border rounded-lg hover:shadow-lg 
                                    ${formData?.traveller == item.people && 'shadow-lg border-black'}`}
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
                <Button
                    disabled={loading}
                    onClick={OnGenerateTrip}>
                    {loading ? 
                        <AiOutlineLoading3Quarters className='h-7 w-7 animate-spin' /> : 'Generate Trip'
                    }
                </Button>
            </div>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogDescription>
                            <img src='/logo.svg' />
                            <h2 className='font-bold text-lg mt-7 flex gap-4 items-center '>Sign In With Google</h2>
                            <p> Sign in securely using your Google account</p>
                            <Button
                                onClick={login}
                                className='mt-5 w-full'>
                                <FcGoogle className='h-7 w-7' />
                                Sign in with google
                            </Button>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            <Footer />
        </div>
    );
}

export default CreateTrip;
