import React from 'react';

const CategoryTabs = ({ categories, activeCategory, onSelectCategory }) => {
    return (
        <div className="sticky top-16 z-40 bg-gray-50/95 backdrop-blur-sm pt-2 pb-2 overflow-x-auto no-scrollbar">
            <div className="flex px-4 gap-3 min-w-max">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => onSelectCategory(cat.id)}
                        className={`
                            px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200
                            ${activeCategory === cat.id
                                ? 'bg-gray-900 text-white shadow-md transform scale-105'
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}
                        `}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoryTabs;
