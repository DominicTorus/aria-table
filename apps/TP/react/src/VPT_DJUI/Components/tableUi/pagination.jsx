import { Button } from 'react-aria-components';
import { BiLeftArrowAlt, BiRightArrowAlt } from 'react-icons/bi';

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 4;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let startPage = Math.max(currentPage - 2, 1);
      let endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

      if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(endPage - maxPagesToShow + 1, 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex w-full items-center justify-center gap-4 ">
      <Button
        className="flex items-center  gap-2 rounded border px-[0.58vw] py-[0.29vw] text-[0.72vw] text-[#344054] shadow focus:outline-none dark:border-[#212121] dark:text-[#FFFFFF]"
        onPress={() => handlePageChange(currentPage - 1)}
        isDisabled={currentPage === 1}
      >
        <BiLeftArrowAlt size={12} /> Previous
      </Button>
      <div className="flex gap-2">
        {getPageNumbers().map((page) => (
          <Button
            key={page}
            className={`pagination-button text-[0.72vw] focus:outline-none dark:text-[#FFFFFF] dark:focus:bg-[#3063FF]/35 ${
              page === currentPage
                ? 'rounded bg-[#E3EAFF] px-[0.58vw] py-[0.29vw] text-[#0736C4]  dark:bg-[#0f0f0f]'
                : 'text-[#667085]'
            }`}
            onPress={() => handlePageChange(page)}
          >
            {page}
          </Button>
        ))}
        {totalPages > 4 && currentPage + 2 < totalPages && (
          <span className="text-[#667085] dark:text-[#FFFFFF]">...</span>
        )}
      </div>
      {totalPages > 4 && currentPage + 1 < totalPages && (
        <Button
          className={`pagination-button text-[0.72vw] focus:outline-none dark:text-[#FFFFFF] ${
            totalPages === currentPage
              ? 'rounded bg-[#E3EAFF] px-[0.58vw] py-[0.29vw]  text-[#0736C4]'
              : 'text-[#667085]'
          }`}
          onPress={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Button>
      )}
      <Button
        className="flex items-center  gap-2 rounded border px-[0.58vw] py-[0.29vw] text-[0.72vw] text-[#344054] shadow focus:outline-none aria-pressed:hidden dark:border-[#212121] dark:text-[#FFFFFF]"
        onPress={() => handlePageChange(currentPage + 1)}
        isDisabled={currentPage === totalPages}
      >
        Next <BiRightArrowAlt size={12} />
      </Button>
    </div>
  );
};
export default Pagination;
