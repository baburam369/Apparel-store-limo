import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown, faArrowUp, faXmark } from '@fortawesome/free-solid-svg-icons'
import { get_products, get_more_products } from '../../store/slices/productsSlice'
import ProductsComponent from './components/ProductsComponent';
import FilterContainer from './components/FilterContainer';
import ScrollToTopButton from '../../components/ScrollToTopButton';

function ShopPage() {
    const dispatch = useDispatch();
    const products = useSelector((state) => state.products.products)
    const numberOfProducts = (products?.pagination?.per_page * products?.pagination?.page_no) - products?.pagination?.total_products > 0 ? products?.pagination?.total_products : products?.pagination?.per_page * products?.pagination?.page_no;
    const [isFilterContainerVisible, setFilterContainerVisible] = useState(false);
    const [sortType, setSortType] = useState(null);
    const [removedCriteria, setRemovedCriteria] = useState(null);
    const observer = useRef();

    const [minMaxValue, setMinMaxValue] = useState({
        minValue: 0,
        maxValue: 100,
    });

    // priceRange is multiple of 60 because RangeSlider does not allow range more than 100
    // maximum price is assumed to be 6000 for now hence 60 multiplied by 100.
    const priceRange = [minMaxValue.minValue * 60, minMaxValue.maxValue * 60];

    const [activeFilters, setActiveFilters] = useState({
        sortType: '',
        range: ''
    })

    const sortHandler = (type) => {
        setSortType(type);
        setActiveFilters({
            ...activeFilters,
            sortType: type,
        })
    }

    const handleRangeChange = (values) => {
        setMinMaxValue({
            minValue: values[0],
            maxValue: values[1],
        })
        setActiveFilters({
            ...activeFilters,
            range: '₹ ' + values[0] * 60 + ' - ' + '₹ ' + values[1] * 60
        })
    };

    const removeFilterCriteria = (type) => {
        //this function removes criteria of filter and sets values to default values.
        // updating removedCriteria triggers useEffect to get updated product values
        if (type === 'RANGE') {
            setMinMaxValue((prev) => ({
                ...prev,
                minValue: 0,
                maxValue: 100,
            }))
            setActiveFilters({
                ...activeFilters,
                range: ''
            })
        }

        if (type === 'SORT_TYPE') {
            setSortType(null);
            setActiveFilters({
                ...activeFilters,
                sortType: '',

            })
        }

        if (type === 'ALL') {
            setSortType(null);
            setMinMaxValue((prev) => ({
                ...prev,
                minValue: 0,
                maxValue: 100,
            }))
            setActiveFilters({
                sortType: '',
                range: '',
            })
        }
        setRemovedCriteria(type)
    }

    const getProducts = (sortType) => {
        dispatch(get_products({
            pageNo: 0,
            sortType,
            from: priceRange[0],
            to: priceRange[1],
        }))
    }

    useEffect(() => {
        getProducts(sortType)
    }, [sortType, removedCriteria])


    const observeScroll = () => {
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {

                if (products?.pagination?.page_no === products?.pagination?.total_pages) {
                    // if total pages retrieved, disconnect the obeserver and return
                    observer.current.disconnect();
                    return;
                }
                // another slice to get one more page and append it to the
                // previously fetched products list also replacing pagination information
                dispatch(get_more_products({
                    pageNo: products?.pagination?.page_no + 1,
                    sortType,
                    from: priceRange[0],
                    to: priceRange[1],
                }))

                observer.current.disconnect();
            }
        }, { threshold: 0.5 });

        const scrollContainer = document.querySelector('.scroll-container');

        if (scrollContainer) {
            // observes the scroll-container className that is attached to the last third product card
            observer.current.observe(scrollContainer);
        }
    }

    useEffect(() => {

        observeScroll();

        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, [products]);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);


    return (
        <>
            <div className=" max-w-7xl  w-full flex flex-col items-center ">
                <div className="w-full">
                    {/* {bannerImage?.url} */}
                    <img className="w-full h-[20rem] object-cover" src='https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' />
                </div>
                <div className='w-full h-[1px] bg-black'></div>
                <div className='sticky top-20 w-full h-8 sm:h-12 flex bg-slate-50 items-center justify-between gap-6 z-10'>
                    <div onClick={() => { setFilterContainerVisible(!isFilterContainerVisible) }} className='group ml-8  border-r border-black flex items-center gap-2 pr-2 cursor-pointer'>
                        <p className='font-thin'>FILTER</p>
                        <FontAwesomeIcon className='group-hover:text-green-400' icon={isFilterContainerVisible ? faArrowUp : faArrowDown} />
                    </div>
                    {numberOfProducts !== 'NaN' && products?.pagination?.total_products && <div className='mr-8 flex gap-1 text-sm sm:text-lg font-semibold text-slate-500'><span>{numberOfProducts}</span><span>of</span><span> {products?.pagination?.total_products}</span></div>}
                </div>
                <div className='w-full flex sm:flex-row flex-col'>
                    {isFilterContainerVisible &&
                        <FilterContainer sortType={sortType} setFilterContainerVisible={setFilterContainerVisible} sortHandler={sortHandler} minMaxValue={minMaxValue} handleRangeChange={handleRangeChange} onDragEndHandler={getProducts} priceRange={priceRange} activeFilters={activeFilters} removeFilterCriteria={removeFilterCriteria} />
                    }
                    <div className={`w-full grid grid-cols-2 md:grid-cols-3 p-4 mt-4 md:p-8 md:mt-0 gap-4`}>
                        <ProductsComponent products={products} />
                    </div>
                </div>
                <ScrollToTopButton />
            </div>
        </>
    )
}

export default ShopPage
