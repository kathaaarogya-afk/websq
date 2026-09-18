"use client";

import Link from "next/link";
import { PenSquare } from "lucide-react";

export default function BecomeWriter(){

return(

<section className="py-24">

<div className="max-w-6xl mx-auto px-6">

<div className="bg-gradient-to-r from-[#FFFDF8] via-[#FFF7E6] to-[#FDECC8] rounded-[40px] p-16 text-center border border-yellow-200 shadow-2xl">

<h2 className="text-5xl font-bold">
Your Story Could Inspire Someone
</h2>

<p className="mt-6 text-xl max-w-3xl mx-auto">

Every experience matters.

Share your journey with the world.

</p>

<Link
href="/write"
className="inline-flex mt-10 bg-white text-yellow-600 px-10 py-4 rounded-full font-bold items-center gap-3 hover:scale-105 transition"
>

<PenSquare/>

Start Writing

</Link>

</div>

</div>

</section>

)

}