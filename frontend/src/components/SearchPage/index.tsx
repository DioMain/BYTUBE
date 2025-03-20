import { observer } from "mobx-react-lite";
import "./style.scss";
import { useStores } from "appStoreContext";
import { Alert, LinearProgress, MenuItem, Select, Stack } from "@mui/material";
import GetUrlParams from "@helpers/GetUrlParams";
import { useCallback, useEffect, useRef, useState } from "react";
import { SelectOrderBy } from "@type/SelectOptions";
import useVideosWithPagination from "@hooks/useVideosWithPagination";
import VideoItem from "./VideoItem";
import StatusBase from "@type/StatusBase";
import { useSearchParams } from "react-router-dom";

const SearchPage: React.FC = observer(() => {
  const sortValues = ["Просмотры", "Новое", "Старое"];

  const searchParams = useSearchParams();

  const search = searchParams[0].get("search") ?? "";

  const observeElement = useRef<HTMLDivElement>(null);

  const { searchData } = useStores();

  const [currentSortValue, setCurrentSortValue] = useState(0);

  const getSortByIndex = useCallback((index: number) => {
    switch (index) {
      case 1:
        searchData.setFilter(SelectOrderBy.CreationDesc);
        break;
      case 2:
        searchData.setFilter(SelectOrderBy.Creation);
        break;
      case 0:
      default:
        searchData.setFilter(SelectOrderBy.Views);
        break;
    }
  }, []);

  const { data, ended, status, refresh } = useVideosWithPagination(observeElement, {
    skip: 0,
    take: 8,
    searchPattern: search,
    orderBy: searchData.selectOptions.orderBy ?? SelectOrderBy.Views,
  });

  useEffect(() => {
    refresh();
  }, [searchData.selectOptions?.orderBy, search]);

  return (
    <Stack className="searchpage" spacing={2}>
      <Stack className="searchpage-tools" direction={"row"} justifyContent={"center"} spacing={2}>
        <Stack spacing={1}>
          <h5>Сориторовка</h5>
          <Select
            value={currentSortValue}
            onChange={(avt) => {
              setCurrentSortValue(avt.target.value as number);
              getSortByIndex(avt.target.value as number);
            }}
          >
            {sortValues.map((item, index) => {
              return (
                <MenuItem value={index} key={`SPS-I${index}`}>
                  {item}
                </MenuItem>
              );
            })}
          </Select>
        </Stack>
      </Stack>
      <Stack className="searchpage-content" spacing={1}>
        {data.map((item, index) => {
          return <VideoItem video={item} key={`SP-VI-${index}`} />;
        })}
        {status === StatusBase.Loading && <LinearProgress />}
        {status === StatusBase.Failed && <Alert severity="error">Во время поиска произошла ошибка!</Alert>}
        {ended ? <Alert severity="info">Больше видео не найдено</Alert> : <div ref={observeElement}></div>}
      </Stack>
    </Stack>
  );
});

export default SearchPage;
