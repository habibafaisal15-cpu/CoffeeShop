"use client";

export function SceneBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 bg-[#8fa88a] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url(/images/coffee-shop-bg.png?v=1)" }}
      aria-hidden
    />
  );
}
