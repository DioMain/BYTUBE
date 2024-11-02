import ChannelModel from "@type/models/ChannelModel";
import PropsBase from "@type/PropsBase";
import "./style.scss";

interface CVProps extends PropsBase {
  channel: ChannelModel;
  imgSize: string;
}

const ChannelView: React.FC<CVProps> = ({ channel, imgSize, style }) => {
  return (
    <div className="channel" style={style}>
      <div
        className="channel-icon"
        style={{ backgroundImage: `url("${channel.iconUrl}")`, width: imgSize, height: imgSize }}
      ></div>
      <div className="channel-col">
        <h4 className="channel-name">{channel.name}</h4>
        <div className="channel-subscounter">{channel.subscribes} подпищиков</div>
      </div>
    </div>
  );
};

export default ChannelView;
