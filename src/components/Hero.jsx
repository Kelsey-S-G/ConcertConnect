import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { HeroImages } from "../data/Data";

const Hero = () => {
  return (
    <div className="relative h-[90vh] w-full bg-gradient-to-b from-gray-900 to-blue-900">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        speed={1000}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          renderBullet: (index, className) => {
            return `<span class="${className} !bg-white/80 !w-3 !h-3"></span>`;
          },
        }}
        className="h-full w-full"
      >
        {HeroImages.map((img) => (
          <SwiperSlide key={img.id}>
            <div className="relative h-full w-full">
              {/* Image */}
              <img
                src={img.src}
                alt={img.alt}
                className="absolute inset-0 h-full w-full object-cover"
              />

              {/* Content Overlay */}
              <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-white text-center px-4">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  {img.title}
                </h1>
                <p className="text-lg md:text-xl max-w-2xl">
                  {img.description}
                </p>
                {img.callToAction && (
                  <button className="mt-8 px-6 py-3 bg-blue-900 hover:bg-blue-800 transition-colors rounded-full font-semibold">
                    {img.callToAction}
                  </button>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Hero;
