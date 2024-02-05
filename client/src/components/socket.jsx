import React from "react";
import {io} from 'socket.io-client'

export const socket =io("ws://localhost:8080")