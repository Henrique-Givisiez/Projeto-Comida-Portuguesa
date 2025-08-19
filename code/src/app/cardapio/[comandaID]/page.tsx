'use client'
import CardapioDesktop from "../_components/Layouts/CardapioDesktop";
import CardapioMobile from "../_components/Layouts/CardapioMobile";
import { useMediaQuery } from "react-responsive";

export default function Cardapio() {
    const isMobile = useMediaQuery({ maxWidth: 768 });

    return isMobile ? <CardapioMobile /> : <CardapioDesktop />;
}
