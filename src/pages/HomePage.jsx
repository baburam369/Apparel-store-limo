import CategoryCard from "../components/CategoryCard";
import Subscribe from "../components/Subscribe";
import InstagramWrapper from "../components/InstagramWrapper";
import { useState, useEffect, useRef } from 'react';
import './HomePage.css'
import { useDispatch, useSelector } from 'react-redux'
import BottomAlert from '../components/BottomAlert'
import { get_categories } from '../store/slices/categorySlice'

function HomePage() {

    const dispatch = useDispatch();
    const bannerRef = useRef(null);
    const productRef = useRef(null);
    const subscribeRef = useRef(null);
    const instagramWrapperRef = useRef(null);
    const message = useSelector((state) => state.message.message);
    const categories = useSelector((state) => state.categories.categories);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry?.target?.id === 'banner-section' && entry.isIntersecting === true) {
                        bannerRef.current.classList.add('slide-in')
                    }
                    if (entry?.target?.id === 'product-section' && entry.isIntersecting === true) {
                        setTimeout(() => {
                            productRef.current.classList.add('slide-in')
                        }, 500)
                    }
                    if (entry?.target?.id === 'instagram-section' && entry.isIntersecting === true) {
                        instagramWrapperRef.current.classList.add('slide-in')
                    }
                })
            },
            { rootMargin: "-10px", }
        );
        observer.observe(bannerRef.current);
        observer.observe(productRef.current);
        observer.observe(instagramWrapperRef.current);
        return () => observer.disconnect();
    }, []);


    useEffect(() => {
        dispatch(get_categories())
    }, [])


    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);

    return (
        <main className="max-w-7xl flex flex-col gap-8 items-center w-full h-full">
            <div ref={bannerRef} id="banner-section" className="w-full h-full">
                <img className='h-[20rem] w-full object-cover' src='https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' />
            </div>
            <div ref={productRef} id="product-section" className="w-11/12   gap-8 grid grid-cols-1 sm:grid sm:grid-cols-2 md:grid md:grid-cols-3  lg:grid lg:grid-cols-4 justify-center">
                {categories && categories?.map((category) => {
                    return <CategoryCard key={category._id} category={category} />
                })}

            </div>
            <div className="w-full">
                <img className="w-full  h-[28rem] object-cover" src='https://plus.unsplash.com/premium_photo-1674748732558-ec38737e30ee?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' />
                <img className="w-full h-[22rem] object-cover" src='https://plus.unsplash.com/premium_photo-1674921631244-66e47b989131?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' />
            </div>
            <InstagramWrapper instagramWrapperRef={instagramWrapperRef} />
            <Subscribe />
            {message && <BottomAlert message={message} />}
        </main>
    )
}

export default HomePage; 