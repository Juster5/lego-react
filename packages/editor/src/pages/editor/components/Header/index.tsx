import React, { useRef, memo, useMemo, useState, useEffect } from 'react';
import { Button, Input, Modal, Upload, Tooltip, Badge } from 'antd';
import {
  ArrowLeftOutlined,
  MobileOutlined,
  DownloadOutlined,
  CopyOutlined,
  DeleteOutlined,
  UndoOutlined,
  RedoOutlined,
  FileAddOutlined,
  CodeOutlined,
  SketchOutlined,
  UploadOutlined,
  InstagramOutlined,
  WechatOutlined,
} from '@ant-design/icons';
import { history } from 'umi';
import QRCode from 'qrcode.react';
import { saveAs } from 'file-saver';
import req from '@/utils/req';
import { uuid } from '@/utils/tool';
import styles from './index.less';
import MyPopover from 'yh-react-popover';
import { encode } from 'querystring';

const { confirm } = Modal;

const isDev = process.env.NODE_ENV === 'development';

interface HeaderComponentProps {
  pointData: any;
  location: any;
  clearData: any;
  undohandler: any;
  redohandler: any;
  importTpl: any;
}

const HeaderComponent = memo((props: HeaderComponentProps) => {
  const { pointData, location, clearData, undohandler, redohandler, importTpl } = props;
  const [showModalIframe, setShowModalIframe] = useState(false);
  const [showFaceModal, setShowFaceModal] = useState(false);
  const [faceUrl, setFaceUrl] = useState('');
  const iptRef = useRef<Input>(null);

  const toPreview = () => {
    localStorage.setItem('pointData', JSON.stringify(pointData));
    savePreview();
    // setTimeout(() => {
    //   window.open(
    //     isDev
    //       ? `/preview?tid=${props.location.query.tid}`
    //       : `/preview?tid=${props.location.query.tid}`,
    //   );
    // }, 600);
     setTimeout(() => {
      window.open(`http://localhost:8008/preview?tid=${props.location.query.tid}&pointData=${encodeURI(JSON.stringify(pointData))}`);
    }, 600);
  };

  const toOnlineCoding = () => {
    window.open('/ide');
  };

  const toVipLogin = () => {
    window.open('/login');
  };

  const content = () => {
    const { tid } = location.query || '';
    return (
      <QRCode value={`${window.location.protocol}//http://localhost:8008/preview?tid=${props.location.query.tid}&pointData=${JSON.stringify(pointData)}`} />
    );
  };

  const generateFace = (type: number) => {
    // ???????????????????????????, ????????????html2canvas ??? dom-to-image
  };

  const handleSaveTpl = () => {
    confirm({
      title: '?????????????????????',
      content: (
        <div className={styles.saveForm}>
          <div className={styles.formIpt}>
            <span>???????????????</span>
            <Input ref={iptRef} />
          </div>
          <div className={styles.formIpt}>
            <span>???????????????</span>
            <Button
              type="primary"
              size="small"
              style={{ marginRight: '20px' }}
              onClick={() => generateFace(1)}
            >
              ??????????????????
            </Button>
            <Button size="small" onClick={() => generateFace(0)}>
              ??????????????????
            </Button>
          </div>
          <div className={styles.formIpt}>
            <span>???????????????</span>
            <Input disabled value="??????????????????????????????????????????????????????" />
          </div>
        </div>
      ),
      okText: '??????',
      cancelText: '??????',
      onOk() {
        let name = iptRef.current!.state.value;
        req.post('/visible/tpl/save', { name, tpl: pointData }).then(res => {
          console.log(res);
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const useTemplate = () => {
    Modal.info({
      title: '???????????????????????????????????????????????????????????????????????????????????????',
      content: (
        <div style={{ textAlign: 'center' }}>
          <img
            src="http://cdn.dooring.cn/dr/qtqd_code.png"
            alt="????????????"
            style={{ width: '180px' }}
          />
        </div>
      ),
      okText: '???????????????',
    });
  };

  const downLoadJson = () => {
    const jsonStr = JSON.stringify(pointData);
    const blob = new Blob([jsonStr], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'template.json');
  };

  const deleteAll = () => {
    Modal.confirm({
      title: '???????????????????',
      okText: '??????',
      cancelText: '??????',
      onOk() {
        clearData();
      },
    });
  };

  const toHelp = () => {
    window.open('/help');
  };

  const toBack = () => {
    history.push('/');
  };

  const newPage = () => {
    clearData();
    history.push(`/editor?tid=${uuid(8, 16)}`);
  };

  const toShare = () => {
    Modal.info({
      title: '?????????????????????????????????, ???Dooring??????',
      content: <img src="http://cdn.dooring.cn/dr/h5door.png" width="300" />,
      okText: '?????????',
    });
  };

  const savePreview = () => {
    const { tid } = props.location.query || '';
    req.post('/visible/preview', { tid, tpl: pointData });
  };
  const handleSaveCode = () => {
    Modal.confirm({
      title: '??????????????????? ????????????????????????2??????~',
      okText: '??????',
      cancelText: '??????',
      onOk() {
        // ???????????????????????????
      },
    });
  };

  useEffect(() => {
    // ?????????????????????????????????
    window.getFaceUrl = (url: string) => {
      setFaceUrl(url);
      setShowModalIframe(false);
    };
  }, []);

  const uploadprops = useMemo<any>(
    () => ({
      name: 'file',
      showUploadList: false,
      beforeUpload(file: File) {
        // ???????????????excel??????
        let reader = new FileReader();
        reader.onload = function(e: Event) {
          let data = (e as any).target.result;
          importTpl && importTpl(JSON.parse(data));
        };
        reader.readAsText(file);
      },
    }),
    [],
  );

  const generatePoster = () => {
    localStorage.setItem('pointData', JSON.stringify(pointData));
    setShowModalIframe(true);
    setTimeout(() => {
      setShowFaceModal(true);
    }, 3600);
  };

  const handleReloadPage = () => {
    (document.getElementById('previewPage') as any).contentWindow.location.reload();
  };

  return (
    <div className={styles.header}>
      <div className={styles.logoArea}>
        <div className={styles.backBtn} onClick={toBack}>
          <ArrowLeftOutlined />
        </div>
        <div className={styles.logo} title="Dooring">
          <a href="/">
            <img src="http://cdn.dooring.cn/dr/logo.ff7fc6bb.png" alt="Dooring-?????????h5?????????" />
          </a>
        </div>
        <a href="http://h5.dooring.cn/h5_plus" target="_blank" className={styles.goPro}>
          ???????????????
        </a>
      </div>
      <div className={styles.controlArea}>
        <Button type="primary" style={{ marginRight: '9px' }} onClick={useTemplate}>
          ?????????
        </Button>
        <Button
          type="link"
          style={{ marginRight: '9px' }}
          onClick={handleSaveTpl}
          disabled={!pointData.length}
        >
          ????????????
        </Button>
        <Upload {...uploadprops}>
          <Button type="link" style={{ marginRight: '8px' }}>
            <UploadOutlined />
          </Button>
        </Upload>
        <Button
          type="link"
          style={{ marginRight: '9px' }}
          onClick={handleSaveCode}
          disabled={!pointData.length}
        >
          <DownloadOutlined />
        </Button>
        <Button
          type="link"
          style={{ marginRight: '9px' }}
          title="??????json??????"
          onClick={downLoadJson}
          disabled={!pointData.length}
        >
          <CopyOutlined />
        </Button>
        <Button
          type="link"
          style={{ marginRight: '9px' }}
          title="????????????"
          onClick={newPage}
          disabled={!pointData.length}
        >
          <FileAddOutlined />
        </Button>
        <MyPopover content={content()} directions="BOTTOM">
          <Button
            type="link"
            style={{ marginRight: '9px' }}
            onClick={savePreview}
            disabled={!pointData.length}
          >
            <MobileOutlined />
          </Button>
        </MyPopover>
        <Button
          type="link"
          style={{ marginRight: '9px' }}
          title="??????"
          onClick={deleteAll}
          disabled={!pointData.length}
        >
          <DeleteOutlined />
        </Button>
        <Button
          type="link"
          style={{ marginRight: '9px' }}
          title="??????"
          onClick={undohandler}
          disabled={!pointData.length}
        >
          <UndoOutlined />
        </Button>
        <Button type="link" style={{ marginRight: '9px' }} title="??????" onClick={redohandler}>
          <RedoOutlined />
        </Button>
        <Tooltip placement="bottom" title="???????????????????????????">
          <Badge dot offset={[-18, 10]}>
            <Button
              type="link"
              style={{ marginRight: '6px' }}
              onClick={generatePoster}
              disabled={!pointData.length}
            >
              <InstagramOutlined />
            </Button>
          </Badge>
        </Tooltip>
        <Button type="link" onClick={toPreview} disabled={!pointData.length}>
          ??????
        </Button>
        <Button
          type="link"
          style={{ marginRight: '5px' }}
          title="????????????"
          onClick={toShare}
          disabled={!pointData.length}
        >
          <WechatOutlined />
        </Button>
        <Button
          type="link"
          style={{ marginRight: '9px' }}
          onClick={toHelp}
          disabled={!pointData.length}
          title="????????????"
        >
          ??????
        </Button>
      </div>
      <div className={styles.btnArea}>
        <Button type="primary" ghost onClick={toOnlineCoding} style={{ marginRight: '12px' }}>
          <CodeOutlined />
          ????????????
        </Button>
        <Button type="primary" ghost onClick={toVipLogin} style={{ marginRight: '12px' }}>
          <SketchOutlined />
          ????????????
        </Button>
      </div>
      <Modal
        title="???????????????...(??????????????????????????????????????????)"
        visible={showModalIframe}
        footer={null}
        width={414}
        closeIcon={<RedoOutlined />}
        destroyOnClose={true}
        onCancel={handleReloadPage}
        maskClosable={false}
      >
        <iframe
          id="previewPage"
          src={`/preview?tid=${props.location.query.tid}&gf=1`}
          style={{ width: '100%', border: 'none', height: '600px' }}
        ></iframe>
      </Modal>
      <Modal
        title="?????????(??????????????????)"
        visible={showFaceModal}
        footer={null}
        width={414}
        destroyOnClose={true}
        onCancel={() => setShowFaceModal(false)}
      >
        <img src={faceUrl} style={{ width: '100%' }} />
      </Modal>
    </div>
  );
});

export default HeaderComponent;
