'use client'
import CardapioDesktop from "../_components/Layouts/CardapioDesktop";
import CardapioMobile from "../_components/Layouts/CardapioMobile";
import { useMediaQuery } from "react-responsive";
import { useParams } from "next/navigation";

export default function Cardapio() {
    const params = useParams<{ comandaID: string }>();

    const comandaId = params.comandaID;

    const isMobile = useMediaQuery({ maxWidth: 768 });

    return isMobile ? <CardapioMobile /> : <CardapioDesktop />;
}
