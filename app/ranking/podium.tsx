"use client";

import Image from "next/image";
import Link from "next/link";
import { Medal } from "lucide-react";

interface PodiumUser {
  id: string;
  name: string;
  points: number;
  rank: number;
  image?: string;
}

interface PodiumProps {
  first: PodiumUser;
  second: PodiumUser;
  third: PodiumUser;
}

export const Podium = ({ first, second, third }: PodiumProps) => {
  return (
    <div className="flex justify-center items-end gap-4 md:gap-8 mt-12 mb-16">
      {/* Second Place */}
      <Link href={`/profile/${second.id}`}>
        <div className="flex flex-col items-center cursor-pointer group">
          <div className="relative mb-4">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center ring-4 ring-slate-300 group-hover:ring-slate-400 transition-all">
              {second.image ? (
                <Image
                  src={second.image}
                  alt={second.name}
                  width={96}
                  height={96}
                  className="rounded-full"
                />
              ) : (
                <span className="text-2xl md:text-3xl">👤</span>
              )}
            </div>
            <div className="absolute -top-3 -right-3 bg-slate-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm">
              2
            </div>
          </div>
          <h3 className="font-bold text-sm md:text-base text-center truncate max-w-[100px] md:max-w-[120px]">
            {second.name}
          </h3>
          <p className="text-slate-600 text-xs md:text-sm">{second.points} pts</p>
          <div className="h-20 md:h-32 bg-slate-300 rounded-t-lg w-16 md:w-20 mt-2 flex items-end justify-center pb-2">
            <Medal className="w-6 h-6 text-slate-600" />
          </div>
        </div>
      </Link>

      {/* First Place */}
      <Link href={`/profile/${first.id}`}>
        <div className="flex flex-col items-center cursor-pointer group">
          <div className="relative mb-4">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center ring-4 ring-yellow-200 group-hover:ring-yellow-300 transition-all">
              {first.image ? (
                <Image
                  src={first.image}
                  alt={first.name}
                  width={128}
                  height={128}
                  className="rounded-full"
                />
              ) : (
                <span className="text-4xl md:text-5xl">👑</span>
              )}
            </div>
            <div className="absolute -top-3 -right-3 bg-yellow-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
              1
            </div>
          </div>
          <h3 className="font-bold text-base md:text-lg text-center truncate max-w-[100px] md:max-w-[140px]">
            {first.name}
          </h3>
          <p className="text-yellow-600 font-bold text-sm md:text-base">
            {first.points} pts
          </p>
          <div className="h-32 md:h-48 bg-yellow-300 rounded-t-lg w-20 md:w-24 mt-2 flex items-end justify-center pb-2">
            <Medal className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </Link>

      {/* Third Place */}
      <Link href={`/profile/${third.id}`}>
        <div className="flex flex-col items-center cursor-pointer group">
          <div className="relative mb-4">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-orange-300 to-orange-500 rounded-full flex items-center justify-center ring-4 ring-orange-200 group-hover:ring-orange-300 transition-all">
              {third.image ? (
                <Image
                  src={third.image}
                  alt={third.name}
                  width={96}
                  height={96}
                  className="rounded-full"
                />
              ) : (
                <span className="text-2xl md:text-3xl">⭐</span>
              )}
            </div>
            <div className="absolute -top-3 -right-3 bg-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm">
              3
            </div>
          </div>
          <h3 className="font-bold text-sm md:text-base text-center truncate max-w-[100px] md:max-w-[120px]">
            {third.name}
          </h3>
          <p className="text-orange-600 text-xs md:text-sm">{third.points} pts</p>
          <div className="h-16 md:h-24 bg-orange-300 rounded-t-lg w-16 md:w-20 mt-2 flex items-end justify-center pb-2">
            <Medal className="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </Link>
    </div>
  );
};
