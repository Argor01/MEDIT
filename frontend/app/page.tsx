'use client';

import { User, ArrowRight, ChevronLeft, ChevronRight, Heart, Shield, Clock, Users, Star, CheckCircle, Phone, Calendar, Pill, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
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
      title: "Мгновенная видео консультация",
      description: "Связь с врачами за 60 секунд.",
      image: "/phone-consultation.svg",
      bgColor: "bg-[#A3DAC2]",
      animation: "animate-bounce"
    },
    {
      id: 2,
      title: "Найти врачей рядом с вами",
      description: "Подтвержденные записи.",
      image: "/laptop-doctors.svg",
      bgColor: "bg-[#F0DA69]",
      animation: "animate-pulse"
    },
    {
      id: 3,
      title: "Лекарства 24/7",
      description: "Доставка к вашей двери.",
      image: "/unicorn-medicine.svg",
      bgColor: "bg-[#E7C2D4]",
      animation: "animate-spin-slow"
    },
    {
      id: 4,
      title: "Лабораторные анализы",
      description: "Взятие анализов на дому.",
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
            MEDIT
          </div>
          <Link href="/auth/login" className="flex items-center space-x-2 bg-gradient-to-r from-[#252B61] to-[#92BDF6] text-white cursor-pointer hover:from-[#252B61]/90 hover:to-[#92BDF6]/90 transition-all duration-300 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 group">
            <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-semibold">Войти</span>
          </Link>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="bg-[#252B61] text-white relative overflow-hidden min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 relative h-full">
          {/* Main Title */}
          <div className="text-center pt-8 pb-4">
            <div className="mb-6">
              <span className="inline-block bg-gradient-to-r from-[#A3DAC2] to-[#E7C2D4] text-[#252B61] px-6 py-2 rounded-full text-sm font-semibold uppercase tracking-wide animate-pulse">
                🏥 Революция в медицине
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight text-white mb-6 animate-fade-in">
              <span className="bg-gradient-to-r from-white via-[#A3DAC2] to-[#E7C2D4] bg-clip-text text-transparent">
                MEDIT
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed animate-slide-up">
              Семейная медицинская платформа нового поколения. Управляйте здоровьем всей семьи в одном приложении.
            </p>
            
            {/* Key Benefits */}
            <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 animate-bounce" style={{animationDelay: '0.2s'}}>
                <Heart className="w-5 h-5 text-[#E7C2D4]" />
                <span className="text-sm font-medium">Семейное здоровье</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 animate-bounce" style={{animationDelay: '0.4s'}}>
                <Shield className="w-5 h-5 text-[#A3DAC2]" />
                <span className="text-sm font-medium">Безопасность данных</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 animate-bounce" style={{animationDelay: '0.6s'}}>
                <Clock className="w-5 h-5 text-[#F0DA69]" />
                <span className="text-sm font-medium">24/7 поддержка</span>
              </div>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8 mb-12">
            <Link href="/auth/login" className="bg-gradient-to-r from-[#F0DA69] to-[#E7C2D4] text-[#252B61] px-8 py-4 rounded-full font-bold text-lg flex items-center space-x-3 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group">
              <span>Начать сейчас</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/auth/doctor-login" className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 rounded-full font-semibold text-lg flex items-center space-x-3 hover:bg-white/20 transition-all duration-300 group">
              <User className="w-6 h-6" />
              <span>Для врачей</span>
            </Link>
          </div>
          

        </div>
      </main>

      {/* Family Subscription Benefits Section */}
      <section className="bg-gradient-to-br from-white via-[#A3DAC2]/10 to-[#E7C2D4]/10 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#A3DAC2] to-[#E7C2D4] text-[#252B61] px-6 py-3 rounded-full text-sm font-semibold mb-6 shadow-lg">
              <Heart className="w-4 h-4" />
              Семейная подписка
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Здоровье Семьи – в <span className="bg-gradient-to-r from-[#252B61] to-[#92BDF6] bg-clip-text text-transparent">Одном Приложении!</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Единая семейная подписка – управляйте здоровьем всех родных без лишних затрат!
            </p>
          </div>

          {/* Family Benefits Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 group">
              <div className="w-16 h-16 bg-gradient-to-r from-[#A3DAC2] to-[#92BDF6] rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Родители</h3>
              <p className="text-gray-600 leading-relaxed">Контролируйте прививки и осмотры детей. Получайте напоминания о важных медицинских процедурах.</p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 group">
              <div className="w-16 h-16 bg-gradient-to-r from-[#E7C2D4] to-[#F0DA69] rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Взрослые</h3>
              <p className="text-gray-600 leading-relaxed">Следите за здоровьем пожилых родителей. Мониторинг показателей и своевременные консультации.</p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 group">
              <div className="w-16 h-16 bg-gradient-to-r from-[#F0DA69] to-[#A3DAC2] rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Вся семья</h3>
              <p className="text-gray-600 leading-relaxed">Общие медкарты, напоминания, онлайн-консультации. Все данные в одном безопасном месте.</p>
            </div>
          </div>

          {/* Subscription Benefits */}
          <div className="bg-gradient-to-r from-[#252B61] to-[#1a1f4a] rounded-3xl p-10 md:p-16 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#A3DAC2]/20 to-[#E7C2D4]/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
            <div className="relative">
              <h3 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                Выгода семейной подписки:
              </h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-[#A3DAC2] to-[#E7C2D4] rounded-full flex items-center justify-center text-[#252B61] font-bold text-2xl mx-auto mb-4">
                    5
                  </div>
                  <h4 className="text-xl font-bold mb-2">До 5 членов семьи</h4>
                  <p className="text-gray-300">в одной учетной записи</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-[#F0DA69] to-[#E7C2D4] rounded-full flex items-center justify-center text-[#252B61] font-bold text-2xl mx-auto mb-4">
                    40%
                  </div>
                  <h4 className="text-xl font-bold mb-2">Экономия до 40%</h4>
                  <p className="text-gray-300">vs индивидуальные подписки</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-[#92BDF6] to-[#A3DAC2] rounded-full flex items-center justify-center text-[#252B61] font-bold text-xl mx-auto mb-4">
                    <Shield className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold mb-2">Гибкие настройки</h4>
                  <p className="text-gray-300">кто что видит и управляет</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MEDIT for Everyone Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#252B61] via-[#1a1f4a] to-[#252B61]"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#A3DAC2]/20 to-[#E7C2D4]/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-[#F0DA69]/20 to-[#92BDF6]/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="relative max-w-7xl mx-auto px-6">
          {/* Main Title */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-full text-sm font-semibold mb-6 shadow-lg">
              <div className="w-2 h-2 bg-gradient-to-r from-[#A3DAC2] to-[#E7C2D4] rounded-full animate-pulse"></div>
              MEDIT для всех
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Не только для пациентов,<br/>
              <span className="bg-gradient-to-r from-[#A3DAC2] via-[#F0DA69] to-[#E7C2D4] bg-clip-text text-transparent">
                но и для клиник
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Революционная AI-CRM система для медицинских учреждений и семейная платформа здоровья
            </p>
          </div>

          {/* Two Main Blocks */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* AI-CRM Block */}
            <div className="group bg-white/10 backdrop-blur-sm rounded-3xl p-10 border border-white/20 hover:bg-white/15 transition-all duration-500 hover:-translate-y-2 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-[#92BDF6] to-[#A3DAC2] rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                  <Activity className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">AI-CRM для Клиник</h3>
                  <p className="text-[#A3DAC2] font-medium">Автоматизация медицинских процессов</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {[
                  { icon: <Users className="w-5 h-5" />, text: "AI-ассистент врача – анализ симптомов и предварительные диагнозы" },
                  { icon: <Calendar className="w-5 h-5" />, text: "Автоматическое расписание – оптимизация записи, снижение простоев" },
                  { icon: <Clock className="w-5 h-5" />, text: "Умные напоминания – пациентам о визитах, врачам о важных случаях" },
                  { icon: <Activity className="w-5 h-5" />, text: "Аналитика потока пациентов – прогнозирование загрузки и динамики" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 text-gray-200 hover:text-white transition-colors duration-300">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#F0DA69] to-[#E7C2D4] rounded-lg flex items-center justify-center text-[#252B61] mt-1 flex-shrink-0">
                      {item.icon}
                    </div>
                    <span className="leading-relaxed">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Family Platform Block */}
            <div className="group bg-white/10 backdrop-blur-sm rounded-3xl p-10 border border-white/20 hover:bg-white/15 transition-all duration-500 hover:-translate-y-2 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-[#E7C2D4] to-[#F0DA69] rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                  <Heart className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Семейная Платформа</h3>
                  <p className="text-[#E7C2D4] font-medium">Здоровье всей семьи под контролем</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {[
                  { icon: <Shield className="w-5 h-5" />, text: "Все медицинские данные в одном безопасном месте" },
                  { icon: <Users className="w-5 h-5" />, text: "Совместный доступ – муж, жена, дети, родители" },
                  { icon: <Activity className="w-5 h-5" />, text: "AI-анализ здоровья – ранние предупреждения о рисках" },
                  { icon: <Phone className="w-5 h-5" />, text: "Телемедицина и консультации с семейными врачами" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 text-gray-200 hover:text-white transition-colors duration-300">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#A3DAC2] to-[#92BDF6] rounded-lg flex items-center justify-center text-[#252B61] mt-1 flex-shrink-0">
                      {item.icon}
                    </div>
                    <span className="leading-relaxed">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Benefits Comparison */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-10 border border-white/10">
            <h3 className="text-3xl font-bold text-center text-white mb-12">
              Почему <span className="bg-gradient-to-r from-[#A3DAC2] to-[#F0DA69] bg-clip-text text-transparent">MEDIT</span> выбирают?
            </h3>
            
            <div className="grid md:grid-cols-2 gap-12">
              {/* For Families */}
              <div className="space-y-6">
                <h4 className="text-2xl font-bold text-[#A3DAC2] mb-6 flex items-center gap-3">
                  <Heart className="w-7 h-7" />
                  Для Семьи
                </h4>
                {[
                  "Все медицинские данные в одном безопасном месте",
                  "Совместный доступ для всех членов семьи",
                  "AI-анализ здоровья с ранними предупреждениями",
                  "Персональные рекомендации для каждого"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 text-gray-200">
                    <CheckCircle className="w-5 h-5 text-[#A3DAC2] flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              {/* For Clinics */}
              <div className="space-y-6">
                <h4 className="text-2xl font-bold text-[#F0DA69] mb-6 flex items-center gap-3">
                  <Activity className="w-7 h-7" />
                  Для Клиник
                </h4>
                {[
                  "Уменьшение нагрузки на администраторов на 50%",
                  "Удержание пациентов через удобный сервис",
                  "Интеграция с медоборудованием",
                  "Автоматическая загрузка и анализ результатов"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 text-gray-200">
                    <CheckCircle className="w-5 h-5 text-[#F0DA69] flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Carousel */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-200/30 to-yellow-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-white/20 text-[#252B61] px-6 py-3 rounded-full text-sm font-semibold mb-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-2 h-2 bg-gradient-to-r from-[#A3DAC2] to-[#E7C2D4] rounded-full animate-pulse"></div>
              Медицинские решения
            </div>
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#252B61] via-[#92BDF6] to-[#A3DAC2] bg-clip-text text-transparent mb-6 leading-tight">
              Ваше здоровье в надежных руках
            </h2>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
              Современные медицинские технологии для комфортного управления здоровьем всей семьи
            </p>
          </div>
          
          {/* Carousel Container */}
          <div className="relative">
            {/* Navigation Arrows */}
            <button 
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group border border-white/20 hover:bg-white hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-[#252B61] transition-colors" />
            </button>
            
            <button 
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group border border-white/20 hover:bg-white hover:scale-110"
            >
              <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-[#252B61] transition-colors" />
            </button>

            {/* Carousel Track */}
            <div className="overflow-hidden rounded-3xl mx-16">
              <div 
                className="flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {services.map((service, index) => (
                  <div key={service.id} className="w-full flex-shrink-0 px-6">
                    <div className={`relative ${service.bgColor} rounded-3xl p-10 md:p-16 overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 group cursor-pointer transform hover:-translate-y-2`}>
                      {/* Decorative Elements */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500"></div>
                      
                      <div className="relative flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="flex-1 space-y-8">
                          <div className="space-y-4">
                            <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-700">
                              Популярная услуга
                            </div>
                            <h3 className="text-3xl md:text-5xl font-bold text-gray-800 leading-tight group-hover:text-gray-900 transition-colors">
                              {service.title}
                            </h3>
                          </div>
                          <p className="text-gray-700 text-lg md:text-xl leading-relaxed">{service.description}</p>
                          <div className="flex items-center gap-4">
                            <button className="group/btn relative w-16 h-16 bg-gradient-to-r from-[#252B61] to-[#92BDF6] rounded-2xl flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 overflow-hidden">
                              <div className="absolute inset-0 bg-white/20 translate-x-full group-hover/btn:-translate-x-0 transition-transform duration-300"></div>
                              <ArrowRight className="relative w-7 h-7 group-hover/btn:translate-x-1 transition-transform duration-300" />
                            </button>
                            <div className="text-sm text-gray-600">
                              <div className="font-semibold">Доступно 24/7</div>
                              <div className="text-xs">Онлайн консультации</div>
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0 relative">
                          <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl group-hover:scale-110 transition-transform duration-500"></div>
                          <img 
                            src={service.image} 
                            alt={service.title} 
                            className={`relative w-32 md:w-40 h-32 md:h-40 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 ${service.animation}`} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Dots Indicator */}
            <div className="flex justify-center mt-12 space-x-4">
              {services.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`relative transition-all duration-300 ${
                    currentSlide === index 
                      ? 'w-12 h-4' 
                      : 'w-4 h-4 hover:w-6'
                  }`}
                >
                  <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
                    currentSlide === index 
                      ? 'bg-gradient-to-r from-[#252B61] to-[#92BDF6] shadow-lg' 
                      : 'bg-white/60 hover:bg-white/80 shadow-md'
                  }`}></div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Почему выбирают <span className="bg-gradient-to-r from-[#252B61] to-[#92BDF6] bg-clip-text text-transparent">MEDIT</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Решения для семей и медицинских учреждений
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* For Families */}
            <div className="bg-white rounded-3xl p-10 shadow-lg border border-gray-100">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-[#A3DAC2] to-[#92BDF6] rounded-full flex items-center justify-center text-white mx-auto mb-6">
                  <Heart className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Для Семьи</h3>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#A3DAC2] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Все медицинские данные в одном безопасном месте</h4>
                    <p className="text-gray-600">Централизованное хранение всех медицинских записей семьи с высоким уровнем защиты</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#92BDF6] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Совместный доступ – муж, жена, дети, родители</h4>
                    <p className="text-gray-600">Гибкая система прав доступа для всех членов семьи</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#E7C2D4] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">AI-анализ здоровья – ранние предупреждения о рисках</h4>
                    <p className="text-gray-600">Искусственный интеллект анализирует данные и предупреждает о потенциальных проблемах</p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Clinics */}
            <div className="bg-white rounded-3xl p-10 shadow-lg border border-gray-100">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-[#E7C2D4] to-[#F0DA69] rounded-full flex items-center justify-center text-white mx-auto mb-6">
                  <Shield className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Для Клиник</h3>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#E7C2D4] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Уменьшение нагрузки на администраторов – AI берет на себя 50% рутины</h4>
                    <p className="text-gray-600">Автоматизация административных процессов с помощью ИИ</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#F0DA69] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Удержание пациентов – удобный сервис = больше лояльности</h4>
                    <p className="text-gray-600">Повышение качества обслуживания и удовлетворенности пациентов</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#92BDF6] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Интеграция с медоборудованием – автоматическая загрузка анализов</h4>
                    <p className="text-gray-600">Прямая интеграция с медицинским оборудованием для автоматизации процессов</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#A3DAC2] to-[#E7C2D4] text-[#252B61] px-6 py-3 rounded-full text-sm font-semibold mb-6 shadow-lg">
              <Activity className="w-4 h-4" />
              Простой процесс
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Как это <span className="bg-gradient-to-r from-[#252B61] to-[#92BDF6] bg-clip-text text-transparent">работает?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Три простых шага к здоровью всей семьи
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-[#A3DAC2] to-[#92BDF6] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  1
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#F0DA69] rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-[#252B61]" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Семья подключается</h3>
              <p className="text-gray-600 leading-relaxed">Семья подключает подписку, добавляет членов, синхронизирует медицинские данные в единой системе.</p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-[#E7C2D4] to-[#F0DA69] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  2
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#92BDF6] rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Клиника внедряет CRM</h3>
              <p className="text-gray-600 leading-relaxed">Клиника внедряет MEDIT CRM – получает AI-ассистентов и продвинутую аналитику пациентов.</p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-[#F0DA69] to-[#A3DAC2] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  3
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#E7C2D4] rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Экономия времени</h3>
              <p className="text-gray-600 leading-relaxed">Врачи и пациенты экономят время – меньше бумажной работы, больше внимания здоровью!</p>
            </div>
          </div>

          {/* Key Functions */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-10 md:p-16">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Основные функции MEDIT
            </h3>
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h4 className="text-2xl font-bold text-[#252B61] mb-6 flex items-center gap-3">
                  <Users className="w-8 h-8" />
                  Семейные аккаунты
                </h4>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#A3DAC2] mt-1 flex-shrink-0" />
                    <span>Объединение медицинских данных всех членов семьи в одном месте</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#A3DAC2] mt-1 flex-shrink-0" />
                    <span>Гибкие права доступа (родители могут управлять данными детей)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#A3DAC2] mt-1 flex-shrink-0" />
                    <span>Общий календарь приёмов, напоминания о прививках и обследованиях</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-2xl font-bold text-[#252B61] mb-6 flex items-center gap-3">
                  <Activity className="w-8 h-8" />
                  Управление здоровьем
                </h4>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#E7C2D4] mt-1 flex-shrink-0" />
                    <span>Медицинская аналитика – тренды по анализам, давлению, уровню сахара</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#E7C2D4] mt-1 flex-shrink-0" />
                    <span>Контроль приёма лекарств – напоминания, предупреждения о несовместимости</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#E7C2D4] mt-1 flex-shrink-0" />
                    <span>Интеграция с медприборами (глюкометры, тонометры, фитнес-трекеры)</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-2xl font-bold text-[#252B61] mb-6 flex items-center gap-3">
                  <Calendar className="w-8 h-8" />
                  Запись к врачам
                </h4>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#F0DA69] mt-1 flex-shrink-0" />
                    <span>Онлайн-запись в клиники-партнёры</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#F0DA69] mt-1 flex-shrink-0" />
                    <span>Синхронизация с семейным календарём</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#F0DA69] mt-1 flex-shrink-0" />
                    <span>AI-ассистент для подбора специалиста по симптомам</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-2xl font-bold text-[#252B61] mb-6 flex items-center gap-3">
                  <Phone className="w-8 h-8" />
                  Телемедицина
                </h4>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#92BDF6] mt-1 flex-shrink-0" />
                    <span>Видеоконсультации с врачами</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#92BDF6] mt-1 flex-shrink-0" />
                    <span>Электронные рецепты с доставкой в аптеки</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#92BDF6] mt-1 flex-shrink-0" />
                    <span>Круглосуточная поддержка и экстренные консультации</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gradient-to-r from-[#252B61] to-[#1a1f4a] py-16 md:py-24 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Отзывы наших пациентов</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Более 10,000 семей уже доверяют нам заботу о своем здоровье
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Анна Петрова",
                role: "Мама двоих детей",
                text: "MEDIT помог нам организовать медицинское обслуживание всей семьи. Особенно удобно следить за прививками детей и записываться к врачам.",
                rating: 5
              },
              {
                name: "Сергей Иванов",
                role: "Предприниматель",
                text: "Телемедицина спасает время! Могу получить консультацию врача прямо из офиса. Качество обслуживания на высшем уровне.",
                rating: 5
              },
              {
                name: "Елена Смирнова",
                role: "Пенсионерка",
                text: "Приложение очень простое в использовании. Внуки помогли настроить, теперь сама записываюсь к врачам и получаю напоминания о лекарствах.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 animate-slide-up" style={{animationDelay: `${index * 0.2}s`}}>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-[#F0DA69] fill-current" />
                  ))}
                </div>
                <p className="text-gray-200 mb-6 leading-relaxed italic">"{testimonial.text}"</p>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-gray-400 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Часто задаваемые вопросы</h2>
            <p className="text-xl text-gray-600">
              Ответы на самые популярные вопросы о нашей платформе
            </p>
          </div>
          
          <div className="space-y-6">
            {[
              {
                question: "Как добавить членов семьи в аккаунт?",
                answer: "В разделе 'Семья' нажмите кнопку 'Добавить члена семьи', заполните основную информацию и отправьте приглашение по email или SMS."
              },
              {
                question: "Безопасны ли мои медицинские данные?",
                answer: "Да, мы используем шифрование по стандартам HIPAA и храним данные на защищенных серверах. Доступ к информации имеете только вы и выбранные вами врачи."
              },
              {
                question: "Сколько стоят консультации врачей?",
                answer: "Стоимость варьируется от 2000 до 3000 рублей в зависимости от специализации врача. Первая консультация для новых пользователей бесплатна."
              },
              {
                question: "Можно ли получить рецепт онлайн?",
                answer: "Да, после телемедицинской консультации врач может выписать электронный рецепт, который будет доступен в вашем личном кабинете."
              },
              {
                question: "Работает ли приложение круглосуточно?",
                answer: "Приложение доступно 24/7. Экстренные консультации доступны круглосуточно, плановые записи - в рабочее время врачей."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors duration-300 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 text-[#A3DAC2] mr-3" />
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed pl-8">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#A3DAC2] via-[#E7C2D4] to-[#F0DA69] py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#252B61] mb-6">
            Начните заботиться о здоровье семьи уже сегодня
          </h2>
          <p className="text-xl text-[#252B61]/80 mb-8 max-w-2xl mx-auto">
            Присоединяйтесь к тысячам семей, которые уже используют MEDIT для управления своим здоровьем
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/login" className="bg-[#252B61] text-white px-8 py-4 rounded-full font-bold text-lg flex items-center space-x-3 hover:bg-[#252B61]/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group">
              <span>Создать аккаунт</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/auth/doctor-login" className="bg-white/20 backdrop-blur-sm text-[#252B61] border-2 border-[#252B61]/30 px-8 py-4 rounded-full font-semibold text-lg flex items-center space-x-3 hover:bg-white/30 transition-all duration-300 group">
              <User className="w-6 h-6" />
              <span>Войти как врач</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#252B61] text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold bg-gradient-to-r from-[#A3DAC2] to-[#E7C2D4] bg-clip-text text-transparent mb-4">
                MEDIT
              </div>
              <p className="text-gray-400 leading-relaxed">
                Семейная медицинская платформа нового поколения для заботы о здоровье всей семьи.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Услуги</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Телемедицина</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Запись к врачам</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Семейный аккаунт</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Мониторинг здоровья</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Поддержка</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Центр помощи</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Связаться с нами</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Политика конфиденциальности</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Условия использования</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; MEDIT. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}