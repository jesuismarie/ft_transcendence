function updatePaginationControls(
	paginationInfo: PaginationInfo,
	total: number,
	offset: number,
	limit: number
) {
	const totalPages = Math.ceil(total / limit);
	const currentPage = Math.floor(offset / limit) + 1;

	paginationInfo.pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
	paginationInfo.prevPageBtn.disabled = offset === 0;
	paginationInfo.nextPageBtn.disabled = offset + limit >= total;
}
