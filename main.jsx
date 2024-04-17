const nav = document.querySelector("nav");
const menuIcon = document.querySelector('.menuIcon');
const menuContainer = document.querySelector(".menuContainer");
const cartIcon = document.querySelector("cartIcon");
const cart = document.querySelector(".cart");
const closeIcon = document.querySelector(".menuContainer .closeIcon");

import * as React from 'react';
declare const ShoppingBagIcon: React.ForwardRefExoticComponent<React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & { title?: string, titleId?: string } & React.RefAttributes<SVGSVGElement>>;
export default ShoppingBagIcon;

window.addEventListener("scroll", () => {
    if (window.scrollY > 30) {
        nav.classList.add("scrolled");
    } else{
        nav.classList.remove("scrolled");
    }
} );

menuIcon.addEventListener("click", () =>{
    menuContainer.classList.add("active");
});

closeIcon.addEventListener("click", () =>{
    menuContainer.classList.remove("active");
});

