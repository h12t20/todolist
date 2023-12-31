import { useAppDispatch, useAppSelector } from "../common/hooks/hook";
import React, { useEffect, useState } from "react";
import { initializeApp } from "features/login/auth-reducer";
import { isInitializedSelector, sortSelector, themeSelector } from "common/selectors/selectors";
import { useSelector } from "react-redux";
import { saveSetting } from "../common/localStorage/localStorage";
import { getSetting } from "./app-reducer";

export const useApp = () => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    dispatch(initializeApp());
    dispatch(getSetting());
  }, []);
  useEffect(() => {
    open && (document.body.style.overflow = "hidden");
    !open && (document.body.style.overflow = "unset");
  }, [open]); // отключает прокрутку при открытом меню

  const isInitialized = useAppSelector(isInitializedSelector);
  const theme = useSelector(themeSelector);
  const sort = useSelector(sortSelector);
  useEffect(() => {
    saveSetting({ theme, sort });
  }, [theme, sort]);
  const handleOpenSwitch = () => (open ? setOpen(false) : setOpen(true));
  const mouseMoveHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.pageX < 40 && e.pageY > 70 && !open) {
      handleOpenSwitch();
    }
  };
  return { isInitialized, open, theme, mouseMoveHandler, handleOpenSwitch };
};
