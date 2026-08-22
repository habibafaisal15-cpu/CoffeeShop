import { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const defaults = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Icon({ size = 20, children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg {...defaults} width={size} height={size} {...props}>
      {children}
    </svg>
  );
}

export function IconHome(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" />
    </Icon>
  );
}

export function IconMenuBook(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 5h7a3 3 0 0 1 3 3v12a3 3 0 0 0-3-3H5V5Z" />
      <path d="M19 5h-7a3 3 0 0 0-3 3v12a3 3 0 0 1 3-3h7V5Z" />
    </Icon>
  );
}

export function IconOrders(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8 6h13" />
      <path d="M8 12h13" />
      <path d="M8 18h13" />
      <path d="M3 6h.01" />
      <path d="M3 12h.01" />
      <path d="M3 18h.01" />
    </Icon>
  );
}

export function IconInfo(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10v6" />
      <path d="M12 7h.01" />
    </Icon>
  );
}

export function IconPhone(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8 3h8l1 4-3 2a11 11 0 0 0 4 4l2-3 4 1v8a2 2 0 0 1-2 2C9.5 21 3 14.5 3 6a2 2 0 0 1 2-2Z" />
    </Icon>
  );
}

export function IconMapPin(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </Icon>
  );
}

export function IconCoffeeCup(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 8h11v8a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V8Z" />
      <path d="M16 10h2a2 2 0 0 1 0 4h-2" />
      <path d="M7 5c0-1 1-2 2-2h4c1 0 2 1 2 2" />
    </Icon>
  );
}

export function IconHotDrink(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8 18h8" />
      <path d="M9 18V8c0-2 1.5-3 3-3s3 1 3 3v10" />
      <path d="M7 8c0-2 2-3 5-3s5 1 5 3" />
      <path d="M12 5V3" />
    </Icon>
  );
}

export function IconIcedDrink(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8 18h8" />
      <path d="M9 18V9l3-4 3 4v9" />
      <path d="M10 10h4" />
      <path d="M11 7h2" />
    </Icon>
  );
}

export function IconPastry(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 14c0-3 2.5-6 6-6s6 3 6 6" />
      <path d="M5 14h14" />
      <path d="M8 14c0 2 1.5 4 4 4s4-2 4-4" />
    </Icon>
  );
}

export function IconSandwich(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 10h14l-1 8H6l-1-8Z" />
      <path d="M6 10 12 5l6 5" />
      <path d="M8 14h8" />
    </Icon>
  );
}

export function IconSnack(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="7" />
      <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="14" cy="11" r="1" fill="currentColor" stroke="none" />
      <circle cx="11" cy="14" r="1" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export function IconMerchandise(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M7 9V7a5 5 0 0 1 10 0v2" />
      <path d="M6 9h12l-1 11H7L6 9Z" />
    </Icon>
  );
}

export function IconSearch(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="11" cy="11" r="6" />
      <path d="m16 16 4 4" />
    </Icon>
  );
}

export function IconFilter(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 6h16" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
      <circle cx="6" cy="6" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="14" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="18" r="1.5" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export function IconHeart(props: IconProps & { filled?: boolean }) {
  const { filled, ...rest } = props;
  return (
    <Icon {...rest}>
      <path
        d="M12 20s-6.5-4.2-8.5-7.5C1.8 9.8 3.2 6.5 6.4 6.2c1.7-.2 3.2.7 4 2 0.8-1.3 2.3-2.2 4-2 3.2.3 4.6 3.6 2.9 6.3C18.5 15.8 12 20 12 20Z"
        fill={filled ? "currentColor" : "none"}
      />
    </Icon>
  );
}

export function IconPlus(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </Icon>
  );
}

export function IconMinus(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 12h14" />
    </Icon>
  );
}

export function IconSun(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2" />
      <path d="M12 19v2" />
      <path d="M3 12h2" />
      <path d="M19 12h2" />
      <path d="M5.6 5.6 7 7" />
      <path d="M17 17l1.4 1.4" />
      <path d="M17 7l1.4-1.4" />
      <path d="M5.6 18.4 7 17" />
    </Icon>
  );
}

export function IconBell(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 4a4 4 0 0 1 4 4v3l1.5 2.5H6.5L8 11V8a4 4 0 0 1 4-4Z" />
      <path d="M10 18a2 2 0 0 0 4 0" />
    </Icon>
  );
}

export function IconScooter(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
      <path d="M9 17h6" />
      <path d="M12 9v4" />
      <path d="M12 9h4l2 4" />
      <path d="M7 13h5" />
    </Icon>
  );
}

export function IconTrackDelivery({
  size = 40,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size * 0.82}
      viewBox="0 0 56 46"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M40 1.5a4 4 0 0 0-4 4c0 3 4 8.5 4 8.5s4-5.5 4-8.5a4 4 0 0 0-4-4Z"
        fill="#E8A898"
      />
      <circle cx="40" cy="5.5" r="1.4" fill="#FFF8F4" />
      <rect x="29.5" y="15.5" width="12.5" height="10.5" rx="2" fill="#4A3728" />
      <rect x="31" y="17" width="9.5" height="3" rx="0.75" fill="#6B5344" />
      <path
        d="M11 32.5h27.5a2 2 0 0 0 2-2v-1.5H16.5l-2.5-7.5a2 2 0 0 0-1.9-1.3H9.5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2Z"
        fill="#E8B4A8"
      />
      <path d="M18.5 21.7 21 14h7.5l3.5 7" stroke="#D49A8C" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M21 14h-2.5" stroke="#C99588" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M18.5 14v-3.5" stroke="#C99588" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M16 10.5h5" stroke="#C99588" strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="15" cy="34.5" r="5.5" fill="#3E2723" />
      <circle cx="15" cy="34.5" r="2.2" fill="#8B7355" />
      <circle cx="37.5" cy="34.5" r="5.5" fill="#3E2723" />
      <circle cx="37.5" cy="34.5" r="2.2" fill="#8B7355" />
      <path d="M20.5 34.5h14" stroke="#5C4033" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

export function IconChat(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 18 6 14H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-4l-3 6-3-6H4" />
    </Icon>
  );
}

export function IconQrScan(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 4h6v6H4z" />
      <path d="M14 4h6v6h-6z" />
      <path d="M4 14h6v6H4z" />
      <path d="M14 14h2v2h-2z" />
      <path d="M18 14h2v6h-2z" />
      <path d="M14 18h2v2h-2z" />
    </Icon>
  );
}

export function IconSparkle(props: IconProps) {
  return (
    <Icon size={12} {...props}>
      <path d="M12 2 13 8l6 1-6 1-1 6-1-6-6-1 6-1 1-6Z" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export const NAV_ICON_MAP = {
  home: IconHome,
  menu: IconMenuBook,
  orders: IconOrders,
  about: IconInfo,
  contact: IconPhone,
  branches: IconMapPin,
  coffee: IconCoffeeCup,
  flame: IconHotDrink,
  snowflake: IconIcedDrink,
  croissant: IconPastry,
  sandwich: IconSandwich,
  cookie: IconSnack,
  bag: IconMerchandise,
} as const;
