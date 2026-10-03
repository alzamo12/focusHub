import PriceCard from "../../components/PriceCard/PriceCard";

const Pricing = () => {
    return (
        <div>
            <main className=" w-full flex overflow-x-hidden overflow-y-hidden 
            px-8 py-10 gap-8">
                <div className="hover-3d w-full">
                    {/* content */}
                    <figure className="w-full rounded-2xl">
                        <PriceCard 
                        category="Free"
                        price={0}
                        />
                    </figure>
                    {/* 8 empty divs needed for the 3D effect */}
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>

                <div className="hover-3d w-full">
                    {/* content */}
                    <figure className="w-full rounded-2xl">
                        <PriceCard
                        category="Basic"
                        price={9}
                        />
                    </figure>
                    {/* 8 empty divs needed for the 3D effect */}
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div className="hover-3d w-full">
                    {/* content */}
                    <figure className="w-full rounded-2xl">
                        <PriceCard
                        category="Premium"
                        price={29}
                        />
                    </figure>
                    {/* 8 empty divs needed for the 3D effect */}
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </main>
        </div>
    );
};

export default Pricing;