import Link from "next/link"
import { BsLinkedin, BsTwitterX, BsFacebook, BsYoutube } from "react-icons/bs"

export const Footer = () => {
    return (
        <footer className=" w-full py-8 gap-4 flex flex-row justify-center items-center bg-gradient-to-br from-themeblue/10  via-themeorange/10 to-themeblue/50 flex-wrap">
           <span className="whitespace-nowrap"> Copyright &copy; 2024 Team MANIT</span>
            <span className="flex flex-row gap-2 flex-nowrap">
                <Link target="_blank" href={"https://www.linkedin.com/company/bureau-of-indian-standards-official/"}>
                    <BsLinkedin/>
                </Link>
                <Link target="_blank" href={"https://www.youtube.com/channel/UCY14t6PrQBFge-8X_4MdoiQ"}>
                    <BsYoutube/>
                </Link>
                <Link target="_blank" href={"https://twitter.com/IndianStandards"}>
                    <BsTwitterX/>
                </Link>
                <Link target="_blank" href={"https://www.facebook.com/IndianStandards/"}>
                    <BsFacebook/>
                </Link>
            </span>
        </footer>
    )
}