import React from "react";
import { Link } from "react-router-dom";

function Card({ modulo, cantidad, url, icon, bgColor, textColor, isSmall = false }) {
    const cardHeight = isSmall ? "h-36" : "h-48";
    const quantitySize = isSmall ? "text-4xl" : "text-5xl";
    const iconSize = isSmall ? "w-8 h-8" : "w-10 h-10";
    const titleSize = isSmall ? "text-lg" : "text-xl";

    return (
        <div className={`${bgColor} rounded-xl shadow-md p-6 flex flex-col justify-between ${cardHeight} transform transition duration-300 hover:shadow-lg hover:-translate-y-1`}>
            <div>
                <div className="flex items-center mb-2">
                    {React.cloneElement(icon, {
                        className: iconSize + ' ' + icon.props.className.split(' ').filter(c => !c.startsWith('w-') && !c.startsWith('h-')).join(' ')
                    })}
                    <h2 className={`font-bold ${titleSize} ml-3 ${textColor}`}>{modulo}</h2>
                </div>
                <p className={`${quantitySize} font-extrabold ${textColor}`}>{cantidad}</p>
            </div>
            <div className="mt-2">
                <Link to={url}>
                    <button
                        className="w-full py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
                    >
                        Gestionar
                    </button>
                </Link>

            </div>
        </div>
    );
}

export default Card;