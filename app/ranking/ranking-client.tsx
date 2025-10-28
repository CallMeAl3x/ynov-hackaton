"use client";

import { useState, useEffect } from "react";
import { Podium } from "./podium";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Trophy, TrendingUp } from "lucide-react";

interface RankingUser {
  id: string;
  name: string;
  points: number;
  rank: number;
  image?: string;
  storiesCount: number;
  email: string;
}

const FILTER_OPTIONS = [
  { id: "week", label: "Cette semaine", period: "week" },
  { id: "month", label: "Ce mois", period: "month" },
  { id: "all", label: "Tous les temps", period: "all" },
];

interface RankingClientProps {
  users: RankingUser[];
}

export const RankingClient = ({ users }: RankingClientProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [ranking, setRanking] = useState<RankingUser[]>(users);

  useEffect(() => {
    // Simuler le changement de données selon la période
    setRanking(users);
  }, [selectedPeriod, users]);

  const first = ranking[0];
  const second = ranking[1];
  const third = ranking[2];
  const rest = ranking.slice(3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <PageHeader
        centered
        icon={
          <>
            <Trophy className="w-8 h-8 md:w-10 md:h-10 text-yellow-500" />
            <Trophy className="w-8 h-8 md:w-10 md:h-10 text-yellow-500" />
          </>
        }
        title="Classement"
        description="Découvrez les meilleurs écrivains de la communauté"
        border={false}
      />

      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* Filter Buttons */}
        <div className="flex justify-center gap-3 mb-12 flex-wrap">
          {FILTER_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedPeriod(option.id)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                selectedPeriod === option.id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-600"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Podium */}
        {first && second && third && (
          <Podium first={first} second={second} third={third} />
        )}

        {/* Ranking Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Top {Math.min(10, rest.length)} de la semaine
              </h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Rang
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Auteur
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Points
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Histoires
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {rest.map((user, index) => (
                  <tr
                    key={user.id}
                    className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center font-bold text-white">
                          {user.rank}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-gray-500 text-sm">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-bold">
                        {user.points}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-gray-700 font-medium">
                        {user.storiesCount} 📖
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link href={`/profile/${user.id}`}>
                        <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-medium">
                          Voir profil
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center border-t-4 border-blue-500">
            <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
              {ranking.length}
            </div>
            <p className="text-gray-600 font-semibold">Auteurs classés</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center border-t-4 border-yellow-500">
            <div className="text-4xl md:text-5xl font-bold text-yellow-600 mb-2">
              {ranking.reduce((sum, user) => sum + user.storiesCount, 0)}
            </div>
            <p className="text-gray-600 font-semibold">Histoires publiées</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center border-t-4 border-purple-500">
            <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">
              {ranking
                .reduce((sum, user) => sum + user.points, 0)
                .toLocaleString()}
            </div>
            <p className="text-gray-600 font-semibold">Points totaux</p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            Comment gagner des points?
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm md:text-base">
            <li>
              <span className="font-bold block mb-2">
                📝 Publier une histoire
              </span>
              <span>+100 points</span>
            </li>
            <li>
              <span className="font-bold block mb-2">
                💬 Obtenir des commentaires
              </span>
              <span>+10 points par commentaire</span>
            </li>
            <li>
              <span className="font-bold block mb-2">
                ⭐ Recevoir des votes
              </span>
              <span>+25 points par vote</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
