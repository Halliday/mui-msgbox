import { VolumeDown, VolumeUp } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle, Slider, Stack } from '@mui/material';
import React, { useState } from 'react';
import { MsgBox, MsgBoxContainer } from './MsgBox';

function App() {

  function simpleMsgBox() {
    MsgBox({
      title: "Simple MsgBox",
      text: "This is a simple MsgBox :)",
      handleOk: () => { console.log("Ok"); },
    });
  }

  function yesNoMsgBox() {
    MsgBox({
      title: "Yes/No MsgBox",
      text: "This is a Yes/No MsgBox.",
      handleYes: () => MsgBox("You clicked Yes."),
      handleNo: () => MsgBox("You clicked No."),
    });
  }

  function okCancelMsgBox() {
    MsgBox({
      title: "Ok/Cancel MsgBox",
      text: "This is an Ok/Cancel MsgBox.",
      handleOk: () => MsgBox("You clicked Ok."),
      handleCancel: () => MsgBox("You clicked Cancel."),
    });
  }

  function customMsgBox() {
    MsgBox(CustomMsgBox);
  }

  return (
    <div id="app">
      <Button onClick={simpleMsgBox}>Simple MsgBox</Button>
      <Button onClick={yesNoMsgBox}>Yes/No MsgBox</Button>
      <Button onClick={okCancelMsgBox}>Ok/Cancel MsgBox</Button>
      <Button onClick={customMsgBox}>Custom MsgBox</Button>
      <MsgBoxContainer />
    </div>
  );
}

function CustomMsgBox(props: DialogProps) {

  function onOkClick() {
    props.onClose?.({}, "escapeKeyDown");
    MsgBox(<>You clicked Ok. <b>Value: {value}</b></>);
  }

  const [value, setValue] = useState(0);
  function onSliderChange(ev: {}, value: number | number[]) {
    setValue(value as number);
  }

  return <Dialog {...props} aria-labelledby="msg-box-title" aria-describedby="msg-box-description">

    <DialogTitle id="msg-box-title">Custom MsgBox</DialogTitle>

    <DialogContent sx={{ minWidth: 350 }}>
      <DialogContentText id="msg-box-description">
        This is a custom MsgBox.<br />
        You can use <b>HTML</b> and <i>JSX</i> here.
      </DialogContentText>
      <Stack spacing={2} direction="row" sx={{ my: 1 }} alignItems="center">
        <VolumeDown />
        <Slider aria-label="Volume" value={value} onChange={onSliderChange} />
        <VolumeUp />
      </Stack>
      <DialogContentText id="msg-box-description">
        Value: {value}
      </DialogContentText>
    </DialogContent>

    <DialogActions>
      <Button onClick={onOkClick} autoFocus>OK</Button>
    </DialogActions>
  </Dialog>;
}

export default App;
