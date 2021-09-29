// Copyright 2020 H2O.ai, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as Fluent from '@fluentui/react'
import { B, Box, box, S, U } from 'h2o-wave'
import React from 'react'
import { keyframes, stylesheet } from 'typestyle'
import { Component, XComponents } from './form'
import { Markdown } from './markdown'
import { toMessageBarType } from "./message_bar"
import { margin, pc, px } from './theme'
import { bond } from './ui'

/**
 * Create a notification bar.
 *
 * A notification bar is an area at the edge of a primary view that displays relevant status information.
 * You can use a notification bar to tell the user about a result of an action, e.g. "Data has been successfully saved".
 */
export interface NotificationBar {
  /** The text displayed on the notification bar. */
  text: S
  /** The icon and color of the notification bar. Defaults to 'info'. */
  type?: 'info' | 'error' | 'warning' | 'success' | 'danger' | 'blocked'
  /** When should the notification bar disappear in seconds. Defaults to 5. */
  timeout?: U
  /** Specify one or more action buttons. */
  buttons?: Component[]
  /** Specify the location of notification. Defaults to 'top-right'. */
  position?: 'top-right' | 'bottom-right' | 'bottom-center' | 'bottom-left' | 'top-left' | 'top-center'
}

export const notificationBarB: Box<NotificationBar | null> = box(null)

type NotificationStyle = {
  iconName: S
  background: S
  color: S
}

const
  gap = 15,
  css = stylesheet({
    notificationBar: {
      $nest: {
        // Adjust spacing to align with Fluent Messagebar icon.
        '.wave-markdown > *:first-child': { marginTop: 0 },
        '.wave-markdown > *:only-child': { marginBottom: 0 },
        '.wave-markdown p': { fontSize: 14, lineHeight: px(20), letterSpacing: '-0.006em' },
        '.ms-MessageBar-dismissal .ms-Button-icon': { fontSize: 16 },
      },

    },
  }),
  notificationTypes: { [K in 'info' | 'error' | 'warning' | 'success' | 'danger' | 'blocked']: NotificationStyle } = {
    'info': {
      iconName: 'InfoSolid',
      background: '#DBEEFD',
      color: '#165589'
    },
    'error': {
      iconName: 'StatusErrorFull',
      background: '#F1CBCB',
      color: '#5E0000'
    },
    'warning': {
      iconName: 'IncidentTriangle',
      background: '#FFF6DC',
      color: '#8F7015'
    },
    'success': {
      iconName: 'SkypeCircleCheck',
      background: '#CAEACA',
      color: '#094609'
    },
    'danger': {
      iconName: 'InfoSolid',
      background: '#DBEEFD',
      color: '#165589'
    },
    'blocked': {
      iconName: 'InfoSolid',
      background: '#DBEEFD',
      color: '#165589'
    },
  }

export default bond(() => {
  let
    timeout: U | undefined,
    lastModel: NotificationBar | null = null,
    initialRender = true
  const
    getAnimation = (shouldBeOpen: B, transform: S) => keyframes({ [shouldBeOpen ? '0%' : '100%']: { transform } }),
    getPosition = (position = 'top-right', shouldBeOpen: B) => {
      if (initialRender) return { top: gap, right: gap, transform: `translateX(calc(100% + ${gap}px))` }
      if (window.innerWidth < 500 + gap) return position.includes('top')
        ? { top: 0, right: 0, left: 0, margin: '0 auto', animationName: getAnimation(shouldBeOpen, 'translateY(-100%)') }
        : { bottom: 0, right: 0, left: 0, margin: '0 auto', animationName: getAnimation(shouldBeOpen, 'translateY(100%)') }

      switch (position) {
        case 'top-right': return { top: gap, right: gap, animationName: getAnimation(shouldBeOpen, `translateX(calc(100% + ${gap}px))`) }
        case 'top-center': return { top: gap, right: 0, left: 0, margin: '0 auto', animationName: getAnimation(shouldBeOpen, `translateY(calc(-100% - ${gap}px))`) }
        case 'top-left': return { top: gap, left: gap, animationName: getAnimation(shouldBeOpen, `translateX(calc(-100% - ${gap}px))`) }
        case 'bottom-right': return { bottom: gap, right: gap, animationName: getAnimation(shouldBeOpen, `translateX(calc(100% + ${gap}px))`) }
        case 'bottom-center': return { bottom: gap, right: 0, left: 0, margin: '0 auto', animationName: getAnimation(shouldBeOpen, `translateY(calc(100% + ${gap}px))`) }
        case 'bottom-left': return { bottom: gap, left: gap, animationName: getAnimation(shouldBeOpen, `translateX(calc(-100% - ${gap}px))`) }
      }
    },
    getIsMultiline = (model: NotificationBar | null) => {
      const textLength = model?.text?.length || 0
      const buttonTextLength = model?.buttons?.filter(({ button }) => button).reduce((prev, curr) => prev + (curr.button?.label?.length || 0) + gap, 0) || 0
      return textLength + buttonTextLength > 54
    },
    onDismiss = () => {
      window.clearTimeout(timeout)
      lastModel = notificationBarB()
      notificationBarB(null)
    },
    render = () => {
      const
        model = notificationBarB(),
        shouldBeOpen = !!model,
        currentModel = model || lastModel,
        { iconName, color, background } = notificationTypes[currentModel?.type || 'info'],
        rootStyles: Fluent.IStyle = {
          position: 'fixed',
          background,
          color,
          borderRadius: 4,
          maxWidth: 500,
          width: pc(100),
          animationDuration: '0.5s',
          animationFillMode: 'forwards',
          '.ms-Link': { color, fontWeight: 600 },
          '.ms-Link:hover': { textDecoration: 'none', color },
          ...getPosition(currentModel?.position, shouldBeOpen)
        },
        isMultiline = getIsMultiline(currentModel)

      initialRender = false

      if (!model?.buttons && shouldBeOpen) timeout = window.setTimeout(onDismiss, model?.timeout || 5000)

      return (
        <Fluent.MessageBar
          key={currentModel?.type}
          styles={{
            root: rootStyles,
            content: { alignItems: isMultiline ? 'start' : 'center' },
            icon: { fontSize: 24, color },
            iconContainer: { margin: margin(16, 16, 16, 24), display: 'flex', alignItems: 'center' },
            text: { margin: margin(16, 0) },
            innerText: { whiteSpace: 'initial !important' },
            dismissal: { fontSize: 16, height: 'auto', margin: margin(16, 16, 16, 0), padding: 0, '.ms-Button-flexContainer': { display: 'block' } },
            dismissSingleLine: { display: 'flex' },
            actions: { margin: 16 }
          }}
          className={css.notificationBar}
          onDismiss={onDismiss}
          messageBarType={toMessageBarType(currentModel?.type)}
          isMultiline={isMultiline}
          actions={currentModel?.buttons ? <XComponents items={currentModel.buttons || []} alignment='end' /> : undefined}
          messageBarIconProps={{ iconName }}
        >
          <Markdown source={currentModel?.text || 'Default text'} />
        </Fluent.MessageBar>
      )
    },
    dispose = () => window.clearTimeout(timeout)

  return { render, notificationBarB, dispose }
})