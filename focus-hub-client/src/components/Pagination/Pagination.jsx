import React from 'react';

const Pagination = ({ setPage, page, totalPage = 1 }) => {
    // console.log(totalPage)
    return (
        <div className="join items-center justify-center mt-8 md:md-0">
            <button
                onClick={() => { setPage(page - 1) }}
                disabled={page === 1}
                className="join-item btn">«</button>
            <button className="join-item btn">{page} &nbsp; / &nbsp; {totalPage || 1}</button>
            <button
                onClick={() => { setPage(page + 1) }}
                disabled={page === totalPage}
                className="join-item btn">»</button>
        </div>
    );
};

export default Pagination;