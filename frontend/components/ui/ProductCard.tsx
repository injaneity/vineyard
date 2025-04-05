'use client'

import React from 'react';
import { ProductCardInfo } from '@/types';
import Image from 'next/image';

export default function ProductCard(data:ProductCardInfo) {
    return (
        <div className='h-[360px] w-[280px] p-3 rounded-xl bg-[#f8f8f8]'>
            <div className='w-full h-[80%] relative'>
                <Image src={data.image} height={1000} width={1000} alt={data.title}
                    className='w-full h-full object-fill rounded-lg' />
                {data.discount > 0 && (
                    <div className='absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm'>
                        -{Math.round(data.discount * 100)}%
                    </div>
                )}
            </div>
            <div className='mt-3 grid grid-cols-12 gap-4 text-black'>
                <div className='col-span-7 font-bold line-clamp-2'>{data.title}</div>
                <div className='col-span-5 text-right font-medium text-2xl'>${data.price.toFixed(2)}</div>
            </div>
        </div>
    )
}