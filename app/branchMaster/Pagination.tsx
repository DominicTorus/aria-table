"use clinet";
import React from "react";
import { Button } from "../../src/Button";
interface PaginationProps {
  page: number;
  total: number;
  onPageChange: (page: number) => void;
}
const Pagination = ({
  page = 0,
  total = 1,
  onPageChange = () => {},
}: PaginationProps) => {
  const pagesToShow = 5; // Number of pages to show around the current page
  const halfPagesToShow = Math.floor(pagesToShow / 2);

  const startPage = Math.max(1, page - halfPagesToShow);
  const endPage = Math.min(total, page + halfPagesToShow);

  const pageNumbers: any = [];

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination flex gap-2 items-center">
      <Button onPress={() => onPageChange(1)} isDisabled={page === 1}>
        {"<<"}
      </Button>
      <Button onPress={() => onPageChange(page - 1)} isDisabled={page === 1}>
        {"<"}
      </Button>
      {pageNumbers.map((number: any) => (
        <Button
          key={number}
          onPress={() => onPageChange(number)}
          isDisabled={number === page}
        >
          {number}
        </Button>
      ))}
      <Button
        onPress={() => onPageChange(page + 1)}
        isDisabled={page === total}
      >
        {">"}
      </Button>
      <Button onPress={() => onPageChange(total)} isDisabled={page === total}>
        {">>"}
      </Button>
    </div>
  );
};

export default Pagination;
