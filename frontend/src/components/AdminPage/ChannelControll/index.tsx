import { observer } from "mobx-react-lite";
import styles from "./styled";
import { useCallback, useEffect, useRef, useState } from "react";
import AdminControllDTO from "@type/AdminControllDTO";
import { Alert, IconButton, LinearProgress, Stack } from "@mui/material";
import useOnSeeElement from "@hooks/useOnSeeElement";
import axios, { AxiosError } from "axios";
import QueriesUrls from "@helpers/QeuriesUrls";
import { Search } from "@mui/icons-material";

const ChannelControll: React.FC = observer(() => {
  const paginationOffset = useRef(0);
  const paginationSize = 8;

  const observerDiv = useRef<HTMLDivElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);

  const [models, setModels] = useState<AdminControllDTO[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [isEnded, setEnded] = useState(false);

  const onSeeHandle = useCallback(() => {
    setLoading(true);
  }, []);

  useOnSeeElement(observerDiv, onSeeHandle);

  const searchElements = async (offset: number, size: number, text: string): Promise<AdminControllDTO[]> => {
    let models: AdminControllDTO[] = [];

    try {
      const response = await axios.get(QueriesUrls.GET_CHANNELS_BY_ADMIN, {
        params: {
          offset: offset,
          count: size,
          namePattern: text,
        },
      });

      models = response.data;
    } catch (err) {
      console.error(err);
    }

    return models;
  };

  useEffect(() => {
    if (isEnded || !isLoading) return;

    searchElements(paginationOffset.current, paginationSize, searchInput.current?.value!).then((value) => {
      setModels([...models, ...value]);

      paginationOffset.current += paginationSize;

      setLoading(false);

      if (value.length == 0) setEnded(true);
    });
  }, [isLoading]);

  const resetSearch = () => {
    paginationOffset.current = 0;

    setEnded(false);
    setModels([]);

    setLoading(true);
  };

  return (
    <styles.ChannelControll spacing={2}>
      {isLoading && <LinearProgress />}

      <Stack>
        <styles.SearchInput direction="row" spacing={2}>
          <input type="text" ref={searchInput} placeholder="Поиск..." />
          <IconButton onClick={resetSearch}>
            <Search />
          </IconButton>
        </styles.SearchInput>
      </Stack>

      <Stack>
        {models.map((value, key) => {
          return <div key={`channel-${key}`}>{value.channel.name}</div>;
        })}
      </Stack>

      {!isEnded ? (
        !isLoading && <div ref={observerDiv}></div>
      ) : (
        <Alert severity="info">Больше каналов не обнаружено</Alert>
      )}
    </styles.ChannelControll>
  );
});

export default ChannelControll;
