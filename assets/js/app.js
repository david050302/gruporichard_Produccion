"use strict";

const $ = (selector, context = document) =>
    context.querySelector(selector);

const $$ = (selector, context = document) =>
    [...context.querySelectorAll(selector)];


/* =========================================
   MENÚ MÓVIL
   ========================================= */

const toggle = $(".menu-toggle");
const nav = $(".nav");

if (toggle && nav) {

    toggle.addEventListener("click", () => {

        const opened = nav.classList.toggle("mobile-open");

        toggle.setAttribute(
            "aria-expanded",
            String(opened)
        );

    });

}


/* =========================================
   SUBMENÚ DE SERVICIOS EN MÓVIL
   ========================================= */

const servicesMenu = $(".nav__services");
const servicesLink = servicesMenu?.querySelector(":scope > a");

if (servicesMenu && servicesLink) {

    servicesLink.addEventListener("click", event => {

        if (window.innerWidth <= 980) {

            event.preventDefault();

            servicesMenu.classList.toggle("open");

        }

    });

}


/* =========================================
   CERRAR MENÚ AL PULSAR UN ENLACE
   ========================================= */

$$(".nav a").forEach(link => {

    link.addEventListener("click", () => {

        if (
            window.innerWidth <= 980 &&
            !link.closest(".nav__services")
        ) {

            nav?.classList.remove("mobile-open");

            toggle?.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    });

});


/* =========================================
   HEADER AL HACER SCROLL
   ========================================= */

const header = $(".header");

function updateHeader() {

    if (!header) return;

    header.classList.toggle(
        "is-scrolled",
        window.scrollY > 20
    );

}

window.addEventListener(
    "scroll",
    updateHeader,
    { passive: true }
);

updateHeader();


/* =========================================
   FAQ ACORDEÓN
   ========================================= */

$$(".faq-btn").forEach(button => {

    button.addEventListener("click", () => {

        const currentItem =
            button.closest(".faq-item");

        if (!currentItem) return;

        const willOpen =
            !currentItem.classList.contains("open");

        /* cerrar las demás */
        $$(".faq-item.open").forEach(item => {

            item.classList.remove("open");

        });

        if (willOpen) {

            currentItem.classList.add("open");

        }

    });

});


/* =========================================
   AÑO AUTOMÁTICO
   ========================================= */

$$("[data-year]").forEach(element => {

    element.textContent =
        new Date().getFullYear();

});


/* =========================================
   FORMULARIO WHATSAPP
   ========================================= */

const form = $("#wa-form");

if (form) {

    form.addEventListener("submit", event => {

        event.preventDefault();

        const formData =
            new FormData(form);

        const nombre =
            formData.get("nombre") || "-";

        const servicio =
            formData.get("servicio") || "-";

        const zona =
            formData.get("zona") || "-";

        const detalle =
            formData.get("detalle") || "-";

        const message =
`Hola Grupo Richard, deseo una cotización.

Nombre: ${nombre}
Servicio: ${servicio}
Distrito / zona: ${zona}
Detalle del trabajo: ${detalle}`;

        const whatsappURL =
            "https://wa.me/51933856058?text=" +
            encodeURIComponent(message);

        window.open(
            whatsappURL,
            "_blank",
            "noopener"
        );

    });

}


/* =========================================
   TARJETAS DE SERVICIOS
   ========================================= */

const serviceCards =
    $$("[data-service-card]");

const reduceMotion =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


/* Animación al entrar en pantalla */

if (
    serviceCards.length &&
    "IntersectionObserver" in window
) {

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting)
                        return;

                    const index =
                        serviceCards.indexOf(
                            entry.target
                        );

                    setTimeout(() => {

                        entry.target
                            .classList
                            .add("is-visible");

                    }, index * 100);

                    observer.unobserve(
                        entry.target
                    );

                });

            },
            {
                threshold: 0.15
            }
        );

    serviceCards.forEach(card =>
        observer.observe(card)
    );

} else {

    serviceCards.forEach(card =>
        card.classList.add("is-visible")
    );

}


/* Luz que sigue el mouse */

serviceCards.forEach(card => {

    card.addEventListener(
        "pointermove",
        event => {

            const rect =
                card.getBoundingClientRect();

            const x =
                event.clientX - rect.left;

            const y =
                event.clientY - rect.top;

            card.style.setProperty(
                "--mouse-x",
                `${x}px`
            );

            card.style.setProperty(
                "--mouse-y",
                `${y}px`
            );

        }
    );

});


/* =========================================
   RESALTADO AUTOMÁTICO DE SERVICIOS
   ========================================= */

let activeService = 0;
let serviceInterval = null;

function highlightService(index) {

    serviceCards.forEach(card =>
        card.classList.remove(
            "is-auto-active"
        )
    );

    if (serviceCards[index]) {

        serviceCards[index]
            .classList
            .add("is-auto-active");

    }

}

function startServiceRotation() {

    if (
        reduceMotion ||
        serviceCards.length < 2 ||
        serviceInterval
    ) {
        return;
    }

    highlightService(activeService);

    serviceInterval =
        setInterval(() => {

            activeService =
                (activeService + 1) %
                serviceCards.length;

            highlightService(
                activeService
            );

        }, 2800);

}

function stopServiceRotation() {

    if (!serviceInterval) return;

    clearInterval(serviceInterval);

    serviceInterval = null;

}


/* En PC pausa el ciclo si el usuario interactúa */

serviceCards.forEach((card, index) => {

    card.addEventListener(
        "mouseenter",
        () => {

            stopServiceRotation();

            serviceCards.forEach(c =>
                c.classList.remove(
                    "is-auto-active"
                )
            );

            card.classList.add(
                "is-auto-active"
            );

        }
    );

    card.addEventListener(
        "mouseleave",
        () => {

            card.classList.remove(
                "is-auto-active"
            );

            activeService =
                (index + 1) %
                serviceCards.length;

            startServiceRotation();

        }
    );

    card.addEventListener(
        "focus",
        () => {

            stopServiceRotation();

            serviceCards.forEach(c =>
                c.classList.remove(
                    "is-auto-active"
                )
            );

            card.classList.add(
                "is-auto-active"
            );

        }
    );

    card.addEventListener(
        "blur",
        () => {

            card.classList.remove(
                "is-auto-active"
            );

            startServiceRotation();

        }
    );

});


startServiceRotation();