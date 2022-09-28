import { ErrorOutline } from "@mui/icons-material";
import { Box, Button, ButtonProps, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle, SxProps } from "@mui/material";
import React, { useInsertionEffect, useState } from "react";

export type MsgBoxNormalState = {
    title?: React.ReactNode,
    text: React.ReactNode,
    handleOk?: React.MouseEventHandler,
    handleYes?: React.MouseEventHandler,
    handleNo?: React.MouseEventHandler,
    handleCancel?: React.MouseEventHandler,
    handleClose?: (ev: {}) => void,
    keepOpen?: boolean,
    buttonProps?: ButtonProps,
    sx?: SxProps,
}

export type MsgBoxCustomState = {
    Dialog: (props: DialogProps) => JSX.Element,
}

export type MsgBoxState = MsgBoxNormalState | MsgBoxCustomState;

type MsgBoxInstance = {
    setState: (state: MsgBoxState | null) => void,
}

let instance: MsgBoxInstance | null = null;

export function MsgBoxContainer() {
    const [state, setState] = useState<MsgBoxState | null>(null);
    const [open, setOpen] = React.useState(false);

    useInsertionEffect(() => {
        const i: MsgBoxInstance = {
            setState: (state) => {
                if (state === null) {
                    setOpen(false);
                } else {
                    setState(state);
                    setOpen(true);
                }
            }
        };
        if(instance !== null) {
            console.error("There are multiple <MsgBoxProvider/> instances! Please use only one <MsgBoxProvider/> on the page.");
            return
        }
        instance = i;
        return () => {
            if(instance === i)
                instance = null;
        }
    }, []);

    const handleClose = (ev: {}) => {
        setOpen(false);
        if (state && "handleClose" in state) {
            state.handleClose?.(ev);
        }
    };

    function fnHandler(h: React.MouseEventHandler): React.MouseEventHandler {
        return (ev: React.MouseEvent) => {
            if (!(state && "keepOpen" in state && state.keepOpen))
                handleClose(ev);
            h(ev);
        }
    }

    let content: JSX.Element | undefined;
    if (state) {
        if ("Dialog" in state) {
            return <state.Dialog open={open} onClose={handleClose} />;
        }

        content = <>
            <DialogTitle id="msg-box-title">{state.title}</DialogTitle>
            <DialogContent sx={{ minWidth: 350 }}>
                <DialogContentText id="msg-box-description">{state.text}</DialogContentText>
            </DialogContent>
            <DialogActions>
                {state.handleOk && <Button onClick={fnHandler(state.handleOk)} autoFocus {...state.buttonProps}>OK</Button>}
                {state.handleYes && <Button onClick={fnHandler(state.handleYes)} autoFocus {...state.buttonProps}>Yes</Button>}
                {state.handleNo && <Button onClick={fnHandler(state.handleNo)} {...state.buttonProps}>No</Button>}
                {state.handleCancel && <Button onClick={fnHandler(state.handleCancel)} {...state.buttonProps}>Cancel</Button>}
            </DialogActions>
        </>
    }

    return <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="msg-box-title"
        aria-describedby="msg-box-description"
        PaperProps={{ sx: state?.sx }}
    >
        {content}
    </Dialog>
}

export function MsgBox(state: MsgBoxState): void;
export function MsgBox(text: React.ReactNode): void;
export function MsgBox(Dialog: (props: DialogProps) => JSX.Element): void;
export function MsgBox(state: MsgBoxState | React.ReactNode | ((props: DialogProps) => JSX.Element)): void {
    if (instance === null) throw new Error("No active <MsgBoxProvider>.");
    if (React.isValidElement(state) || typeof state === "string" || typeof state === "boolean") instance.setState({text: state});
    else if (typeof state === "function") instance.setState({Dialog: state});
    else instance.setState(state as MsgBoxState);
}

export async function reportError(err: any) {
    if (!err) return;
    return new Promise((resolve) => {
        const [title, text] = checkError(err);
        MsgBox({
            title: <><ErrorOutline sx={{ verticalAlign: "sub", mr: 1 }} />{title}</>,
            text,
            sx: { bgcolor: "#fdeded", color: "#5f2120" },
            handleOk: () => {},
            handleClose: resolve,
            buttonProps: {
                color: "error"
            }
        });
    })
}

function checkError(err: any): [title: string, content: JSX.Element | string] {
    let title: string;
    let text: JSX.Element | string;

    if (typeof err === "string") {
        return ["Error", err];
    }

    if ("code" in err && "method" in err && "name" in err && "desc" in err && "url" in err) {
        title = "API Error";
        text = <>
            Failed to call the server API.<br />
            {err.code} {err.name.toUpperCase()}<br />
            {monospace(`${err.method} ${err.url}`)}<br />
            Message: {monospace(`${err.desc}`)}
        </>;
    }

    if ("title" in err) title = err.title;
    else if ("name" in err) title = err.name;
    else title = "Error";

    if ("message" in err) text = err.message;
    else if ("desc" in err) text = err.desc;
    else if ("text" in err) text = err.text;
    else if ("msg" in err) text = err.msg;
    else text = `${err}`;

    return [title, text];
}

function monospace(text: string) {
    return <Box sx={{ fontFamily: 'Monospace' }} component="span">{text}</Box>
}