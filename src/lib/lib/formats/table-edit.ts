import { ActionSheetHandlerOption, HandlerType } from '../toolbar/help';
import { TableEditFormatter } from '../edit-frame/fomatter/table-edit-formatter';

export const tableEditHandler: ActionSheetHandlerOption = {
  type: HandlerType.ActionSheet,
  classes: ['tanbo-editor-icon-table-edit'],
  tooltip: '编辑表格',
  actions: [{
    label: '在左边添加列',
    execCommand: new TableEditFormatter(),
    classes: ['tanbo-editor-icon-table-add-column-left']
  }, {
    label: '在右边添加列',
    execCommand: new TableEditFormatter(),
    classes: ['tanbo-editor-icon-table-add-column-right']
  }, {
    label: '在上边添加行',
    execCommand: new TableEditFormatter(),
    classes: ['tanbo-editor-icon-table-add-row-top']
  }, {
    label: '在下边添加行',
    execCommand: new TableEditFormatter(),
    classes: ['tanbo-editor-icon-table-add-row-bottom']
  }, {
    label: '向左合并单元格',
    execCommand: new TableEditFormatter(),
    classes: ['tanbo-editor-icon-table-merge-left']
  }, {
    label: '向右合并单元格',
    execCommand: new TableEditFormatter(),
    classes: ['tanbo-editor-icon-table-merge-right']
  }, {
    label: '向上合并单元格',
    execCommand: new TableEditFormatter(),
    classes: ['tanbo-editor-icon-table-merge-top']
  }, {
    label: '向下合并单元格',
    execCommand: new TableEditFormatter(),
    classes: ['tanbo-editor-icon-table-merge-bottom']
  }, {
    label: '删除左边列',
    execCommand: new TableEditFormatter(),
    classes: ['tanbo-editor-icon-table-delete-column-left']
  }, {
    label: '删除右边列',
    execCommand: new TableEditFormatter(),
    classes: ['tanbo-editor-icon-table-delete-column-right']
  }, {
    label: '删除上边行',
    execCommand: new TableEditFormatter(),
    classes: ['tanbo-editor-icon-table-delete-row-top']
  }, {
    label: '删除下边行',
    execCommand: new TableEditFormatter(),
    classes: ['tanbo-editor-icon-table-delete-row-bottom']
  }, {
    label: '拆分列',
    execCommand: new TableEditFormatter(),
    classes: ['tanbo-editor-icon-table-split-columns']
  }, {
    label: '拆分行',
    execCommand: new TableEditFormatter(),
    classes: ['tanbo-editor-icon-table-split-rows']
  }]
};