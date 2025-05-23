import { Stack } from "@mui/material";
import styles from "./styles";

const PrivacyPage: React.FC = () => {
  return (
    <styles.PrivacyPage spacing={2}>
      <Stack>
        <h1 style={{ textAlign: "center" }}>Политика конфиденциальности</h1>
        <h3>
          Дата обновления: <span>18.04.2025</span>
        </h3>
      </Stack>
      <p>
        BYTUBE ("мы", "наш", "сервис") — это некоммерческий видеохостинг, который уважает вашу конфиденциальность. Эта
        Политика объясняет, как мы обрабатываем данные, а также условия размещения контента на нашей платформе.
      </p>
      <h3>Какие данные мы собираем</h3>
      <p>
        Данные аккаунта: имя, email, дата рождения (если указана), зашифрованный пароль. Пользовательский контент:
        загруженные видео, комментарии, плейлисты.
      </p>
      <h3>Как мы используем ваши данные</h3>
      <p>
        Обеспечения работы платформы (хостинг видео, учетные записи). Модерации контента и защиты от нарушений. Анализа
        статистики (без персонализации рекламы). Ответа на законные запросы органов власти.
      </p>
      <h3>Публичность контента</h3>
      <p>
        Важно знать что ВЕСЬ загруженный контент по умолчанию общедоступен, если не выбран режим приватности ("Только по
        ссылке" или "Закрытый доступ"). Пользователи могут просматривать, комментировать и делиться вашими видео (если
        они публичны). BYTUBE не предотвращает копирование или перезагрузку контента другими пользователями.
      </p>
      <h3>Авторские права и блокировка</h3>
      <p>
        Мы соблюдаем законы об авторском праве (DMCA и аналоги). При обоснованных жалобах правообладателей видео может
        быть заблокировано (частично или полностью) и может быть удалёно при подтверждённых нарушениях. Вы можете
        оспаривать блокировку через контржалобу.
      </p>
      <h3>Обмен данными с третьими лицами</h3>
      <p>
        Мы не передаём данные рекламным компаниям или маркетинговым партнёрам. Информация может раскрываться только:
        Правообладателям (при проверке авторских прав) и Государственным органам (по юридическому запросу).
      </p>
      <h3>Cookies и аналитика</h3>
      <p>
        Мы используем только необходимые cookies для: Авторизации пользователей и базовой аналитики (без трекинга для
        рекламы). Вы можете отключить аналитику в настройках браузера.
      </p>
      <h3>Ваши права</h3>
      <p>
        Вы можете удалять или редактировать свой контент. Запросить удаление аккаунта (контент может сохраниться, если
        нарушает правила). Отказаться от сбора необязательных данных.
      </p>
      <h3>Безопасность</h3>
      <p>
        Применяем стандартные меры защиты (шифрование, модерация), но не гарантируем абсолютную безопасность в
        интернете.
      </p>
      <div>
        Контакты: <a href="mailto: starsversquad@gmail.com">starsversquad@gmail.com</a>
      </div>
    </styles.PrivacyPage>
  );
};

export default PrivacyPage;
