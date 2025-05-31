

import { useEffect } from "react";

const usePageTitle = (title) => {
    useEffect(() => {
        if (!title) return; // 제목이 없을 땐 실행 안 함
        const $title = document.getElementsByTagName("title")[0];
        $title.innerText = title;
    }, [title]);
};

export default usePageTitle;
