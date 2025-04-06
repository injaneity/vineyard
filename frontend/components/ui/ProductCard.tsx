'use client'

import React from 'react';
import { ProductCardInfo } from '@/types';
import Image from 'next/image';

export default function ProductCard({ title, price, image, link, discount }: ProductCardInfo) {
    return (
        <a href={link} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
            <div className='h-[360px] w-[280px] p-3 rounded-xl bg-[#f8f8f8]'>
                <div className='w-full h-[80%] relative'>
                    <Image src={image} height={1000} width={1000} alt={title}
                        className='w-full h-full object-fill rounded-lg' />
                    {discount > 0 && (
                        <div className='absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm'>
                            -{Math.round(discount * 100)}%
                        </div>
                    )}
                </div>
                <div className='mt-3 grid grid-cols-12 gap-4 text-black'>
                    <div className='col-span-7 font-bold line-clamp-2'>{title}</div>
                    <div className='col-span-5 text-right font-medium text-2xl'>${price.toFixed(2)}</div>
                </div>
            </div>
        </a>
    )
}