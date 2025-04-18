import { Alert, Grid2, IconButton, LinearProgress, Stack } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { Search } from "@mui/icons-material";
import styles from "./styled";
import AdminControllDTO from "@type/ChannelControllDTO";
import useOnSeeElement from "@hooks/useOnSeeElement";
import axios from "axios";
import QueriesUrls from "@helpers/QeuriesUrls";
import ChannelItem from "./ChannelItem";
import ChannelView from "./ChannelView";

const ChannelControll: React.FC = observer(() => {
  const paginationOffset = useRef(0);
  const paginationSize = 8;

  const observerDiv = useRef<HTMLDivElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);

  const [models, setModels] = useState<AdminControllDTO[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [isEnded, setEnded] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AdminControllDTO | null>(null);

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

  const onItemClickHandle = useCallback(
    (item: AdminControllDTO) => {
      setSelectedItem(item);
    },
    [setSelectedItem]
  );

  const onItemChangedHandle = (value: AdminControllDTO) => {
    const items = models;

    const index = items.findIndex((element) => element.channel.id === value.channel.id);

    items[index] = value;

    setModels([...items]);
  };

  const onItemDeletedHandle = (value: AdminControllDTO) => {
    const index = models.findIndex((element) => element.channel.id === value.channel.id);

    setModels([...models.splice(0, index), ...models.splice(1, models.length - 1)]);
    setSelectedItem(null);
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

      <Grid2 container spacing={1}>
        <Grid2 size={6}>
          <Stack spacing={2}>
            {models.map((value, key) => {
              return (
                <ChannelItem
                  key={`channel-${key}`}
                  item={value}
                  onClick={onItemClickHandle}
                  onItemChanged={onItemChangedHandle}
                  onItemDeleted={onItemDeletedHandle}
                />
              );
            })}
          </Stack>
        </Grid2>
        <Grid2 size={6}>
          <ChannelView item={selectedItem} />
        </Grid2>
      </Grid2>

      {!isEnded ? (
        !isLoading && <div ref={observerDiv}></div>
      ) : (
        <Alert severity="info">Больше каналов не обнаружено</Alert>
      )}
    </styles.ChannelControll>
  );
});

export default ChannelControll;
