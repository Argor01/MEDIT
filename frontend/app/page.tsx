'use client';

import { User, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Скролл вниз - скрываем header
        setIsHeaderVisible(false);
      } else {
        // Скролл вверх - показываем header
        setIsHeaderVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);
  
  const services = [
    {
      id: 1,
      title: "Мгновенная видео\nконсультация.",
      description: "Связь с врачами за 60 секунд.",
      image: "/phone-consultation.svg",
      bgColor: "bg-[#A3DAC2]",
      animation: "animate-bounce"
    },
    {
      id: 2,
      title: "Найти врачей\nрядом с вами.",
      description: "Подтвержденные записи.",
      image: "/laptop-doctors.svg",
      bgColor: "bg-[#F0DA69]",
      animation: "animate-pulse"
    },
    {
      id: 3,
      title: "Лекарства\n24/7.",
      description: "Доставка к вашей двери.",
      image: "/unicorn-medicine.svg",
      bgColor: "bg-[#E7C2D4]",
      animation: "animate-spin-slow"
    },
    {
      id: 4,
      title: "Лабораторные\nанализы.",
      description: "Забор образцов на дому.",
      image: "/lab-tests.svg",
      bgColor: "bg-[#92BDF6]",
      animation: "animate-wiggle"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % services.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + services.length) % services.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className={`sticky top-0 z-50 bg-gradient-to-r from-white via-[#A3DAC2]/20 to-[#E7C2D4]/20 backdrop-blur-md px-6 py-5 border-b border-white/20 shadow-lg shadow-[#92BDF6]/30 rounded-b-3xl transition-transform duration-300 ease-in-out ${
        isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-3xl font-bold bg-gradient-to-r from-[#252B61] to-[#92BDF6] bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 cursor-pointer">
            Medcare
          </div>
          <div className="flex items-center space-x-2 bg-gradient-to-r from-[#252B61] to-[#92BDF6] text-white cursor-pointer hover:from-[#252B61]/90 hover:to-[#92BDF6]/90 transition-all duration-300 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 group">
            <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-semibold">Войти</span>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="bg-[#252B61] text-white relative overflow-hidden min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 relative h-full">
          {/* Main Title */}
          <div className="text-center pt-8 pb-4">
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold leading-tight text-white mb-8">
              Healthcare
            </h1>
            
            {/* Indicators */}
            <div className="flex items-center justify-center space-x-16 mb-12">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-[#E7C2D4] rounded-full"></div>
                <span className="text-lg font-medium">Reduce HbA1c</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-[#A3DAC2] rounded-full"></div>
                <span className="text-lg font-medium">No More Medications</span>
              </div>
            </div>
          </div>
          
          {/* Doctor Image - Centered */}
          <div className="flex justify-center mb-8">
            <img 
              src="/doctor-photo.png" 
              alt="Доктор со стетоскопом" 
              className="w-72 md:w-80 lg:w-96 h-auto rounded-2xl shadow-none border-0"
            />
          </div>
          
          {/* Bottom Section */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-between items-end px-6">
            {/* Left Text */}
            <div className="max-w-xs">
              <p className="text-sm text-gray-300 leading-relaxed">
                IF YOU ARE LOOKING FOR A CREATIVE AND EASY WAY TO BUILD A WEBSITE, HERE'S THE PERFECT SOLUTION.
              </p>
            </div>
            
            {/* Right Button */}
            <div>
              <button className="bg-[#F0DA69] text-[#252B61] px-6 py-3 rounded-full font-semibold flex items-center space-x-2 hover:bg-[#F0DA69]/90 transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105">
                <span>Book Consultation</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Services Carousel */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Наши услуги</h2>
          <p className="text-gray-600 text-lg">Выберите подходящую для вас медицинскую услугу</p>
        </div>
        
        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Arrows */}
            <button 
              onClick={prevSlide}
              className="carousel-nav-button absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group border border-gray-200"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-[#252B61] transition-colors" />
            </button>
            
            <button 
              onClick={nextSlide}
              className="carousel-nav-button absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group border border-gray-200"
            >
              <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-[#252B61] transition-colors" />
            </button>

          {/* Carousel Track */}
          <div className="overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {services.map((service, index) => (
                 <div key={service.id} className="w-full flex-shrink-0 px-4">
                   <div className={`service-card ${service.bgColor} rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-lg group cursor-pointer`}>
                     <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                       <div className="flex-1 space-y-6">
                         <h3 className="text-2xl md:text-4xl font-bold text-gray-800 leading-tight">
                           {service.title.split('\n').map((line, i) => (
                             <span key={i}>
                               {line}
                               {i < service.title.split('\n').length - 1 && <br />}
                             </span>
                           ))}
                         </h3>
                         <p className="text-gray-700 text-lg md:text-xl">{service.description}</p>
                         <button className="w-14 h-14 bg-[#252B61] rounded-full flex items-center justify-center text-white hover:bg-[#252B61]/80 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110 group">
                           <ArrowRight className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
                         </button>
                       </div>
                       <div className="flex-shrink-0">
                         <img 
                           src={service.image} 
                           alt={service.title} 
                           className={`service-image w-24 md:w-32 h-24 md:h-32 opacity-70 ${service.animation}`} 
                         />
                       </div>
                     </div>
                   </div>
                 </div>
               ))}
            </div>
          </div>

          {/* Dots Indicator */}
            <div className="flex justify-center mt-8 space-x-3">
              {services.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`carousel-dot w-3 h-3 rounded-full ${
                    currentSlide === index 
                      ? 'bg-[#252B61] scale-125 shadow-lg active' 
                      : 'bg-gray-300 hover:bg-[#92BDF6] hover:scale-110'
                  }`}
                />
              ))}
            </div>
        </div>
      </section>
    </div>
  );
}