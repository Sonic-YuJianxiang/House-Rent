import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { useSelector } from "react-redux";
import "swiper/css/bundle";
import {
    FaBath,
    FaBed,
    FaChair,
    FaMapMarkedAlt,
    FaMapMarkerAlt,
    FaParking,
    FaShare,
} from "react-icons/fa";
import Contact from "../components/Contact";

export default function Listing() {
    SwiperCore.use([Navigation]);
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);
    const [contact, setContact] = useState(false); //
    const { listingId } = useParams();
    const {currentUser} = useSelector((state) => state.user);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/listing/get/${listingId}`);
                const data = await response.json();
                if (data.success === true) {
                    return;
                }
                setListing(data);
                setLoading(false);
                setError(false);
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        };
        fetchListing();
    }, [listingId]);

    return (
        <main>
            {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
            {error && <p>Something went wrong</p>}
            {listing && !loading && !error && (<div>
                <Swiper navigation>
                    {listing.imageUrls.map((url)>(
                        <SwiperSlide key={url}>
                            <div className="h-[550px]" style={{background: `url(${url}) center no-repeat`, backgroundSize: 'cover'}}>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>   
                <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
                    <FaShare
                        className='text-slate-500'
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            setCopied(true);
                            setTimeout(() => {
                            setCopied(false);
                            }, 2000);
                        }}
                    />
                </div>
                {copied && (
                    <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
                    Link copied!
                    </p>
                )}
                <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
                    <p className='text-2xl font-semibold'>
                        {listing.name} - ${' '}
                        {listing.offer
                            ? listing.discountPrice.toLocaleString('en-US')
                            : listing.regularPrice.toLocaleString('en-US')}
                        {listing.type === 'rent' && ' / month'}
                    </p>
                    <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
                        <FaMapMarkerAlt className='text-green-700' />
                        {listing.address}
                    </p>
                    <div className="">
                        <p className="bg-red-900 w-full max-w-{200px} text-white text-center p-1 rounded-md">
                            {listing.type === "rent" ? "For Rent" : "For Sale"}
                        </p>
                        {
                            listing.offer && (
                                <p className="bg-green-900 w-full max-w-{200px} text-white text-center p-1 rounded-md">
                                    ${+listing.regularPrice - +listing.discountPrice}
                                </p>
                            )
                        }
                        <p className="text-slate-800">
                            <span className="font-semibold text-black ">
                                Description --- {' '}
                            </span>
                            {listing.description}
                        </p>
                        <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
                            <li className="flex items-center gap-1 whitespace-nowrap text-green-900 font-semibold text-sm">
                                <FaBed className="text-lg" />
                                {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
                            </li>
                            <li className="flex items-center gap-1 whitespace-nowrap text-green-900 font-semibold text-sm">
                                <FaBath className="text-lg" />
                                {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}
                            </li>
                            <li className="flex items-center gap-1 whitespace-nowrap text-green-900 font-semibold text-sm">
                                <FaParking className="text-lg" />
                                {listing.parking ? "Parking Available" : "No Parking"}
                            </li>
                            <li className="flex items-center gap-1 whitespace-nowrap text-green-900 font-semibold text-sm">
                                <FaChair className="text-lg" />
                                {listing.furniture ? "Furnished" : "Unfurnished"}
                            </li>
                        </ul>
                        {currentUser && listing.userRef !== currentUser._id && !contact && (<button onClick={()=>setContact(true)} className="bg-slate-700 
                        text-white rounded-lg uppercase hover:opacity-95 p-3">Contact landlord</button>)}
                        {contact && <Contact listing={listing}/>}
                    </div>
                </div>
            </div>
            )}
        </main>
    );
}