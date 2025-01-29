import React, { useState } from 'react';
import { Button } from '../button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import axios from 'axios';

function Header() {

  const user = JSON.parse(localStorage.getItem('user'));
  const [openDialog, setOpenDialog] = useState(false);

  const login = useGoogleLogin({
    onSuccess: (codeResp) => {
        const accessToken = codeResp?.access_token;
        if (accessToken) {
            GetUserProfile(accessToken);
        }
    },
    onError: (error) => console.error(error),
});

const GetUserProfile = (accessToken) => {
  axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`, {
      headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'Application/json'
      }
  }).then(resp => {
      localStorage.setItem('user', JSON.stringify(resp.data)); 
      setOpenDialog(false); 
      window.location.reload(); 
  }).catch(error => {
      console.error('Error fetching user profile:', error); 
  });
};

  return (
    <div className='w-full p-3 mt-1 shadow-sm flex justify-between items-center px-4 sm:px-6 lg:px-10'>
      <a href="/">
        <img src='/logo.svg' alt="Logo" className='h-6 sm:h-8 md:h-10' />
      </a>
      <div className="flex items-center gap-2 sm:gap-4">
        {user ? (
          <>
            <a href='/create-trip'>
              <Button variant="outline" className="rounded-full text-xs sm:text-sm py-1 sm:py-2 px-3 sm:px-6">+ Create Trip</Button>
            </a>

            <a href='/my-trips'>
              <Button variant="outline" className="rounded-full text-xs sm:text-sm py-1 sm:py-2 px-3 sm:px-6">My Trips</Button>
            </a>
            
            <Popover>
              <PopoverTrigger className="px-2 py-1 bg-transparent text-white cursor-pointer rounded-full">
                <img
                  src={user?.picture}
                  alt="User Profile"
                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-full"
                />
              </PopoverTrigger>
              <PopoverContent className=" w-auto h-auto mx-4">
                <h2 className='cursor-pointer ' onClick={() => { 
                  googleLogout(); 
                  localStorage.clear(); 
                  window.location.reload(); 
                }}>Logout</h2>
              </PopoverContent>
            </Popover>
          </>
        ) : (
          <Button onClick={() => setOpenDialog(true)}>Sign In</Button>
        )}
      </div>
      
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <img src='/logo.svg' />
              <h2 className='font-bold text-lg mt-7 flex gap-4 items-center '>Sign In With Google</h2>
              <p>Sign in securely using your Google account</p>
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
    </div>
  );
}

export default Header;
