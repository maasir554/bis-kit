"use client"

import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Skeleton } from './ui/skeleton';

import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SquareArrowOutUpRightIcon } from 'lucide-react';

export const TopScorers = () =>{

const [leaderboard, setLeaderboard] = useState
    <
    {
        id: string;
        name: string,
        profilepiclink: string | null,
        currentTotalPoints: number | null
    }[] | undefined
    >(undefined);

useEffect(()=>{
    (async()=>{
        try{
            const response = await fetch("/api/leaderboard");
            const data = await response.json();
            console.log(data);
            setLeaderboard(data.splice(0,3));
        }
        catch(error){
            console.log("unsble to get leaderboard data\n", error);
        }
    })()
},[])


// if (leaderboard) setLeaderboard(leaderboard => leaderboard?.slice(0,3))

return (
    <>
{
!!leaderboard?

<Swiper
      modules={[Autoplay, Pagination, Navigation]}
      spaceBetween={50}
    //   slidesPerView={1}
      className='h-[200px] max-w-[300px] sm:max-w-[400px] md:max-w-[500px] w-[100%]'
      loop={true}
      autoplay={{
        delay: 2000,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
>
      {/* <SwiperSlide className='object-contain flex justify-center items-center bg-black/30 rounded-xl'>Slide 1</SwiperSlide>
      <SwiperSlide className='object-contain flex justify-center items-center bg-black/30 rounded-xl'>Slide 2</SwiperSlide>
      <SwiperSlide className='object-contain flex justify-center items-center bg-black/30 rounded-xl'>Slide 3</SwiperSlide>
      <SwiperSlide className='object-contain flex justify-center items-center bg-black/30 rounded-xl'>Slide 4</SwiperSlide> */}
        {
            !!leaderboard&&
            leaderboard?.map((user,idx)=>
                <SwiperSlide key={idx} className=' bg-black/30 rounded-xl min-w-0 px-4 hover:bg-black/40 transition-colors'>
                    <Link 
                    href={`/profile/${user.id}`}
                    className='flex flex-row w-full justify-center items-center gap-4 md:gap-8 h-full'
                    >
                        <Image src={user.profilepiclink||"https://github.com/shadcn.png"}  className='w-75 h-75 rounded-full flex' width={100} height={100} alt="profile" />
                        <span className=' h-full flex flex-col items-start justify-center gap-2'>
                            <span className='font-semibold text-xl text-themeorange'>
                                Rank {idx+1}
                            </span>
                            <span className='font-medium text-sm sm:text-lg md:text-xl flex flex-row items-center gap-2'>
                                {user?.name!}
                                <SquareArrowOutUpRightIcon/>
                            </span>
                            <span className='flex flex-row gap-3 justify-start items-center'>
                                <span className='w-4 h-4 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-700 '></span>
                                <span className='font-semibold text-xl'>{user.currentTotalPoints}</span>
                            </span>
                        </span>

                    </Link>
                </SwiperSlide>
            )
        }
    </Swiper>
    :
    <Skeleton className='w-full h-[200px]'> </Skeleton>
    }
    </>
)
}
