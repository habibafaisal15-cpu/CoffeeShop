"use client";

/** Latte cup — overlaps hero top, sits under cart panel, peeks below */
export function HeroCoffeeDecor() {
  return (
    <div
      className="pointer-events-none absolute z-[5] hidden h-[22rem] w-[12rem] sm:block sm:right-[calc(20%-2rem)] sm:-top-[9.25rem] md:right-[calc(min(20%,18.5rem)-2.5rem)] md:-top-[9.25rem] md:h-[26rem] md:w-[13.5rem] lg:right-[calc(min(20%,18.5rem)-5.5rem)] lg:-top-[10.5rem] lg:h-[30rem] lg:w-[15rem] xl:right-[calc(min(20%,18.5rem)-6rem)] xl:-top-[13.75rem] xl:h-[min(52rem,calc(100vh-3rem))] xl:w-[17rem]"
      aria-hidden
    >
      <img
        src="/images/hero-coffee-cup.png?v=3"
        alt=""
        width={900}
        height={900}
        decoding="async"
        className="relative z-[2] h-full w-full object-contain object-bottom drop-shadow-[0_20px_32px_rgba(42,30,23,0.28)]"
      />
    </div>
  );
}
