
/*
 * react sample program
 * Copyright (c) 2022 Cybozu
 *
 * Licensed under the MIT License
 * https://opensource.org/licenses/mit-license.php
 */

import React from 'react'
import ReactDOM from 'react-dom'
import { AppSwitcher } from './components/App'
import GanttCharts from './components/GanttCharts'
import AddSub from './components/AddSub'

interface KintoneEvent {
  record: kintone.types.SavedFields
}

// レコード一覧のメニューの右側の空白部分の要素に、ガントチャート、カンバンを切り替えるボタンを表示する
kintone.events.on('app.record.index.show', (event: KintoneEvent) => {
  ReactDOM.render(<AppSwitcher />, kintone.app.getHeaderMenuSpaceElement())
  return event
})

// レコード詳細画面のメニューの上側の空白部分の要素に、該当レコードの関連する親子タスクのガントチャートを表示する
kintone.events.on('app.record.detail.show', (event: KintoneEvent) => {
  let query = `parent = ${event.record.$id.value} or $id= ${event.record.$id.value}`
  event.record.parent.value && (query += ` or $id = ${event.record.parent.value}`)
  ReactDOM.render(<GanttCharts query={query} />, kintone.app.record.getHeaderMenuSpaceElement())
  // スペースフィールド「addSub」に、子タスクを追加するボタンを表示する
  ReactDOM.render(<AddSub id={event.record.$id.value} />, kintone.app.record.getSpaceElement('addSub'))
  return event
})

// スペースフィールド「addSub」に設置した「add sub task」ボタンをクリックして、レコード追加画面を開いた場合、
// 親タスクのレコード id を、追加された子タスクのレコードの「親タスク ID」フィールドに指定する
kintone.events.on('app.record.create.show', (event: KintoneEvent) => {
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  const pid = urlParams.get('pid')
  if (pid) {
    event.record.parent.value = pid
  }
  return event
})
