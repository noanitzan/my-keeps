"use client";

import Link from "next/link";
import { Image as ImageIcon, Quote, BookOpen, Palette, Film } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-turquoise-950 mb-4">
            My Keeps
          </h1>
          <p className="text-xl text-turquoise-900">
            Collect and organize the things that bring you joy
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link
            href="/images"
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-turquoise-100 rounded-full p-6 mb-4 group-hover:bg-turquoise-200 transition-colors">
                <ImageIcon className="w-12 h-12 text-turquoise-900" />
              </div>
              <h2 className="text-2xl font-semibold text-turquoise-950 mb-2">
                Images
              </h2>
              <p className="text-turquoise-900">
                Upload and organize your favorite images
              </p>
            </div>
          </Link>

          <Link
            href="/quotes"
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-turquoise-100 rounded-full p-6 mb-4 group-hover:bg-turquoise-200 transition-colors">
                <Quote className="w-12 h-12 text-turquoise-900" />
              </div>
              <h2 className="text-2xl font-semibold text-turquoise-950 mb-2">
                Quotes
              </h2>
              <p className="text-turquoise-900">
                Save and share inspiring quotes
              </p>
            </div>
          </Link>

          <Link
            href="/poems"
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-turquoise-100 rounded-full p-6 mb-4 group-hover:bg-turquoise-200 transition-colors">
                <BookOpen className="w-12 h-12 text-turquoise-900" />
              </div>
              <h2 className="text-2xl font-semibold text-turquoise-950 mb-2">
                Poems
              </h2>
              <p className="text-turquoise-900">
                Collect beautiful poems and verses
              </p>
            </div>
          </Link>

          <Link
            href="/galleries"
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-turquoise-100 rounded-full p-6 mb-4 group-hover:bg-turquoise-200 transition-colors">
                <Palette className="w-12 h-12 text-turquoise-900" />
              </div>
              <h2 className="text-2xl font-semibold text-turquoise-950 mb-2">
                Galleries & Exhibitions
              </h2>
              <p className="text-turquoise-900">
                Track art shows and exhibitions you love
              </p>
            </div>
          </Link>

          <Link
            href="/movies"
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-turquoise-100 rounded-full p-6 mb-4 group-hover:bg-turquoise-200 transition-colors">
                <Film className="w-12 h-12 text-turquoise-900" />
              </div>
              <h2 className="text-2xl font-semibold text-turquoise-950 mb-2">
                Movies
              </h2>
              <p className="text-turquoise-900">
                Keep track of your favorite films
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
