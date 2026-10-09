import React from 'react';

const PriceCard = ({category, price}) => {
    return (
        <div className="aura aura-lg text-primary w-full">
            <div className="card w-full bg-base-100 shadow-sm text-base-content">
                <div className="card-body">
                    <span className="badge badge-xs badge-warning">Most Popular</span>
                    <div className="flex justify-between">
                        <h2 className="text-3xl font-bold">{category}</h2>
                        <span className="text-xl">${price}/mo</span>
                    </div>
                    <ul className="mt-6 flex flex-col gap-2 text-xs">
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                            <span>High-resolution image generation</span>
                        </li>
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                            <span>Customizable style templates</span>
                        </li>
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                            <span>Batch processing capabilities</span>
                        </li>
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                            <span>AI-driven image enhancements</span>
                        </li>
                        <li className="opacity-50">
                            <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                            <span className="line-through">Seamless cloud integration</span>
                        </li>
                        <li className="opacity-50">
                            <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                            <span className="line-through">Real-time collaboration tools</span>
                        </li>
                    </ul>
                    <div className="mt-6 ">
                        <button className="btn btn-primary not-dark:text-black btn-block">Subscribe</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PriceCard;