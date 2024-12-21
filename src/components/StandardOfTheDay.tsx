"use client"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export const StandardOfTheDay = () => {
    
    const [standard, setStandard] = useState(null)
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        async function fetchStandard() {
          try {
            const response = await fetch('/api/daily-standard')
            const data = await response.json()
            setStandard(data)
          } catch (error) {
            console.error('Error fetching standard:', error)
          } finally {
            setLoading(false)
          }
        }
    
        fetchStandard()
      }, [])

    

    return <span id="standard-of-the-day" className="col-start-1 min-h-[200px] col-span-2 rounded-2xl bg-[linear-gradient(94.24deg,_rgba(0,119,182,0.7)_73.59%,_#D9D9D9B2_105.78%)] flex flex-col row-start-1 row-end-2 sm:px-12 py-8 px-6 sm:py-10 md:px-16 md:py-14 h-fit">
                <h1 className="text-lg md:text-xl lg:text-2xl font-semibold text-neutral-100 mb-2">
                    Standard of the day:
                </h1> 
                {
                    loading
                    ? 
                    <span className="opacity-30">
                        {/* Loading... */}
                        <Skeleton className="w-1/2 h-[50px] rounded-xl mb-5 bg-opacity-10 " />
                        <Skeleton className="w-1/2 h-[20px] rounded-xl mb-5  bg-opacity-10 " />
                        <Skeleton className="w-full h-[20px] rounded-xl mb-5  bg-opacity-10 " />
                        <Skeleton className="w-full h-[20px] rounded-xl mb-5  bg-opacity-10 " />
                        <Skeleton className="w-1/4 h-[50px] rounded-xl mb-5  bg-opacity-10 " />
                    </span>
                    :
                    standard?
                    <>
                        <span className=" text-2xl md:text-3xl lg:text-4xl font-bold text-transparent bg-gradient-to-r from-themeorange via-white to-[#34D399] bg-clip-text w-fit mb-2">
                            {/* IS 616 : 2017IEC 60065 : 2014 */}
                            {standard["ISO NAME"]}
                        </span>
                        <span className="text-xs md:text-sm font-semibold mb-2 text-neutral-200">
                            Reviewed in : {standard["REVIEW YEAR"]}
                        </span>

                        <span className="text-sm mb-4 ">
                            <h1 className="text-sm md:text-md lg:text-lg font-semibold text-white pl-2">Service or Equipment: </h1>
                            <p className=" text-xs md:text-sm lg:text-base pl-2">
                            {/* {"Audio Visual Equipment like Television, Speakers, Printers, Scanners etc"} */}
                            {standard["SERVICE/EQUIPMENT"]}
                            </p>
                        </span>

                        <h3 className="font-semibold text-white text-sm md:text-md lg:text-lg pl-2">
                            Description:
                        </h3>
                        <p className="text-xs md:text-sm lg:text-base font-normal text-neutral-100 mb-5 pl-2">
                            {
                                // "The        Standard        provides        safety requirements for audio video equipments against          Hazards  like  electric  shock, mechanical, radiation, fire, implosion and chemical burns."
                                standard["field5"]
                            }
                        </p>   
                        
                        <Link 
                        target="_"
                        href ={
                            
                            // "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/Indian_standards/isdetails_mnd/12999" 
                            standard["field2"]?standard["field2"]:"https://www.bis.gov.in/"
                        } 
                        className="py-3 px-5 bg-neutral-200 hover:bg-white w-fit justify-center items-center text-black font-bold rounded-full flex flex-row gap-2 group active:scale-95 transition-transform"
                        >
                            Read more
                            <ArrowUpRight className="group-hover:scale-110" />
                        </Link> 
                    </>
                    :
                    <h1>
                        {"Not available ;-("}
                    </h1>
                }
                
            </span>
}

