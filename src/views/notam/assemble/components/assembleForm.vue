<template>
  <div>
    <tiny-form v-if="preCondition" overflow-title label-width="200px" :rules="rules">
      <!--可以添加选项-->
      <tiny-floatbar v-if="false" :style="floatSize">
        <ul>
          <li @click="onResizePdf">{{ pdfState }}</li>
          <iframe src="/pdf/白云机场机场图.pdf" width="100%" :style="pdfSize" type="application/pdf" />
        </ul>
      </tiny-floatbar>
      <tiny-button
type="primary" :modal-overlay-opening-padding="100" :modal-overlay-opening-radius="100"
        @click="stepStart">开始引导</tiny-button>
      <tiny-button
type="danger" :modal-overlay-opening-padding="100" :modal-overlay-opening-radius="100"
        @click="onChangeView">切换视角</tiny-button>
      <tiny-button
v-if="!isEmpty(createData.parentId) && createData.parentId !== 0" type="success" :modal-overlay-opening-padding="100"
        :modal-overlay-opening-radius="100" @click="onRead">查看关联的源通告</tiny-button>
      <tiny-guide :show-step="showStep" :dom-data="domData"></tiny-guide>
      <tiny-row class="guide-box1">
        <tiny-divider
content-position="left" offset="5%" font-size="20px" content-background-color="#1476ff"
          content-color="#ffffff">请选择需要发布的通告类型</tiny-divider>
        <tiny-row>
          <tiny-col :span="8">
            <tiny-form-item label="通告类型">
              <!--单选框-->
              <tiny-radio-group
v-model="createData.messageType" :disabled="act === 'edit' || messageType != 'cnl'"
                @change="onChangeMessageType">
                <tiny-radio-button
v-for="(item, index) in messageTypeOption" :key="index" :label="item"
                  :value="item"></tiny-radio-button>
              </tiny-radio-group>
            </tiny-form-item>
          </tiny-col>
          <tiny-col v-if="false" v-show="createData.messageType !== '新发报文'" :span="4">
            <tiny-form-item label="通告序列号">
              <tiny-input v-model="createData.aftnSn" :disabled="act === 'edit'"> </tiny-input>
            </tiny-form-item>
          </tiny-col>
        </tiny-row>
        <tiny-row>
          <tiny-col :span="12">
            <tiny-form-item label="Q项">
              <template #label>
                <tiny-tooltip type="info" content="根据需要修改发生地的经纬度信息和影响范围；默认所在机场" placement="top">
                  <div>Q项<tiny-icon-help-solid class="IconHelpSolid"></tiny-icon-help-solid></div>
                </tiny-tooltip>
              </template>
              <tiny-col v-show="view" :span="isNoAuth ? 4 : 2.5" style="margin:2px">
                <tiny-form-item label-width="60px" label="情报区">
                  <tiny-input v-model="createData.qAirSpace" :disabled="act === 'edit'"> </tiny-input>
                </tiny-form-item>
              </tiny-col>
              <tiny-col v-show="view" :span="isNoAuth ? 4 : 2.5" style="margin:2px">
                <tiny-form-item label-width="60px" label="代码">
                  <tiny-input v-model="createData.qCode" :disabled="act === 'edit'"> </tiny-input>
                </tiny-form-item>
              </tiny-col>
              <tiny-col v-show="view" :span="isNoAuth ? 4 : 2.5" style="margin:2px">
                <tiny-form-item label-width="60px" label="类型">
                  <tiny-input v-model="createData.qFlightType" :disabled="act === 'edit'"> </tiny-input>
                </tiny-form-item>
              </tiny-col>
              <tiny-col v-show="view" :span="isNoAuth ? 4 : 2.5" style="margin:2px">
                <tiny-form-item label-width="60px" label="目的">
                  <tiny-input v-model="createData.qTarget" :disabled="act === 'edit'"> </tiny-input>
                </tiny-form-item>
              </tiny-col>
              <tiny-col v-show="view" :span="isNoAuth ? 4 : 2.5" style="margin:2px">
                <tiny-form-item label-width="60px" label="范围">
                  <tiny-input v-model="createData.qReach" :disabled="act === 'edit'"> </tiny-input>
                </tiny-form-item>
              </tiny-col>
              <tiny-col v-show="view" :span="isNoAuth ? 4 : 2.5" style="margin:2px">
                <tiny-form-item label-width="60px" label="下限">
                  <tiny-input v-model="createData.qLowerLimit" :disabled="act === 'edit'"></tiny-input>
                </tiny-form-item>
              </tiny-col>
              <tiny-col v-show="view" :span="isNoAuth ? 4 : 2.5" style="margin:2px">
                <tiny-form-item label-width="60px" label="上限">
                  <tiny-input v-model="createData.qUpperLimit" :disabled="act === 'edit'"></tiny-input>
                </tiny-form-item>
              </tiny-col>
              <tiny-col v-show="false" :span="isNoAuth ? 4 : 2.5" style="margin:2px">
                <tiny-form-item label-width="60px" label="纬度">
                  <tiny-input v-model="createData.qLat" placeholder="请输入纬度" :disabled="act === 'edit'">
                  </tiny-input>
                </tiny-form-item>
              </tiny-col>
              <tiny-col v-show="false" :span="isNoAuth ? 4 : 2.5" style="margin:2px">
                <tiny-form-item label-width="60px" label="经度">
                  <tiny-input v-model="createData.qLong" placeholder="请输入经度" :disabled="act === 'edit'">
                  </tiny-input>
                </tiny-form-item>
              </tiny-col>
              <tiny-col :span="isNoAuth ? 4 : 2.5" style="margin:2px">
                <tiny-form-item label-width="150px" label="请输入事件影响半径">
                  <tiny-input v-model="createData.qRadius" placeholder="请输入影响半径" :disabled="act === 'edit'">
                  </tiny-input>
                </tiny-form-item>
              </tiny-col>
            </tiny-form-item>
          </tiny-col>
        </tiny-row>
      </tiny-row>
      <!-- <tiny-row class="guide-box2" v-show="messageType !== 'cnl' && messageType !== 'replace'"> -->
      <tiny-row class="guide-box2">
        <tiny-divider
content-position="left" offset="5%" font-size="20px" content-background-color="#1476ff"
          content-color="#ffffff">发生地与生效期</tiny-divider>
        <tiny-row>
          <tiny-col v-show="view" :span="4">
            <!--情报区或者机场两大类选择器-->
            <tiny-form-item label="A项(发生地)">
              <tiny-select
v-model="createData.a_airSpace" filterable placeholder="请选择情报区/机场" value-field="codeId"
                text-field="txtName" disabled clearable @change="onChangeA">
                <tiny-option-group v-for="group in aOptions" :key="group.label" :label="group.label">
                  <tiny-option
v-for="item in group.options" :key="item.value" :label="item.label"
                    :value="item.value"></tiny-option>
                </tiny-option-group>
              </tiny-select>
            </tiny-form-item>
          </tiny-col>
          <tiny-col v-show="messageType !== 'cnl'" :span="7">
            <!--生效时间-->
            <tiny-form-item label="事件是否有明确的生效时间">
              <tiny-radio-group v-model="createData.validType" size="mini" :disabled="act === 'edit'">
                <tiny-radio-button
v-for="(item, index) in messageValidTypeOption" :key="index" :label="item.label"
                  :text="item.text"></tiny-radio-button>
              </tiny-radio-group>
            </tiny-form-item>
          </tiny-col>
          <tiny-col v-show="messageType !== 'cnl'" :span="6">
            <!--时间-->
            <tiny-form-item label="事件生效时间">
              <tiny-date-picker
v-model="createData.startTime" type="datetime" placeholder="请选择生效时间（北京时）"
                format="yyMMddHHmm" value-format="yyMMddHHmm" :disabled="act === 'edit'" @change="onChangeB">
              </tiny-date-picker>
            </tiny-form-item>
          </tiny-col>
          <tiny-col v-show="(createData.validType !== 'PERM' && createData.messageType !== '取消现有报文')" :span="6">
            <!--时间-->
            <tiny-form-item label="事件失效时间">
              <tiny-date-picker
v-model="createData.endTime" type="datetime" 	default-time="00:01:00" placeholder="请选择失效时间（北京时）"
                format="yyMMddHHmm" value-format="yyMMddHHmm" :disabled="act === 'edit'"></tiny-date-picker>
            </tiny-form-item>
          </tiny-col>
          <tiny-row>
            <tiny-col v-if="createData.messageType !== '代替现有报文' && createData.messageType !== '取消现有报文'" :span="12">
              <!--分段时间-->
              <tiny-form-item label="分段时间">
                <tiny-input
v-model="createData.d_time" placeholder="如分时间段进行，请选择自定义时间（北京时）" :disabled="act === 'edit'"
                  @focus="onFocus"> </tiny-input>
              </tiny-form-item>
            </tiny-col>
          </tiny-row>
        </tiny-row>

      </tiny-row>
      <tiny-row class="guide-box3">
        <tiny-divider
content-position="left" offset="5%" font-size="20px" content-background-color="#1476ff"
          content-color="#ffffff">请选择或输入原始资料内容的必填项目和选填项目</tiny-divider>
        <!--E项-->
        <div style="margin: 1%;">事件场景:{{ createData.circumstances }}</div>
        <tiny-form-item v-show="act === 'add'" label-width="0px">
          <tiny-row v-if="false">
            <tiny-col :span="6">
              <tiny-form-item label="naip数据源">
                <tiny-select
v-model="naipDataPeriod" :options="naipDataPeriodOptions" placeholder="请选择naip数据期数"
                  clearable filterable></tiny-select>
              </tiny-form-item>
            </tiny-col>
          </tiny-row>

          <tiny-collapse v-model="activeNames" class="demo-collapse-wrap">
            <tiny-collapse-item title="必填项" name="必填项">
              <tiny-col>
                <formgenerator
v-if="preCondition" ref="childRef" :key-word="keyWord" :key-word-label="keyWordLabel"
                  :static-data="staticData" />
              </tiny-col>
            </tiny-collapse-item>
            <tiny-collapse-item v-if="matches.matchesOptionalLabel.length > 0" title="选填项" name="选填项">
              <tiny-col v-for="(item, index) in matches.matchesOptionalLabel" :key="'optional' + index" :span="6">
                <tiny-form-item :label="item">
                  <tiny-input v-model="eFormData.optionalList[index]" placeholder="请输入" clearable></tiny-input>
                </tiny-form-item>
              </tiny-col>
            </tiny-collapse-item>
            <tiny-collapse-item title="示例" name="示例">
              <tiny-col :span="4">
                <tiny-form-item>
                  <div>标准规范</div>
                  <tiny-input v-model="createData.template" type="textarea" autosize disabled> </tiny-input>
                </tiny-form-item>
              </tiny-col>
              <tiny-col :span="4">
                <tiny-form-item>
                  <div>示例文本</div>
                  <tiny-input v-model="createData.example" type="textarea" autosize disabled> </tiny-input>
                </tiny-form-item>
              </tiny-col>
              <tiny-col :span="4">
                <tiny-form-item>
                  <div>备注</div>
                  <tiny-input v-model="createData.remark" type="textarea" autosize disabled> </tiny-input>
                </tiny-form-item>
              </tiny-col>
            </tiny-collapse-item>
          </tiny-collapse>
        </tiny-form-item>
        <tiny-col :span="12">
          <!--额外的正文文本-->
          <tiny-form-item label="需要特别说明的：">
            <tiny-input v-model="createData.specialNotes" type="textarea" :disabled="act === 'edit'"></tiny-input>
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="4">
          <!--影响高度范围-->
          <tiny-form-item v-if="!isEmpty(createData.qLowerLimit)" label="影响高度范围">
            <tiny-select
v-model="createData.baseType" value-field="fg" text-field="fg" :grid-op="baseTypeOption"
              render-type="grid" :disabled="act === 'edit'" placeholder="请选择影响到的高度" @change="onChangeBaseType()">
            </tiny-select>
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="4">
          <!--下限-->
          <tiny-form-item v-if="!isEmpty(createData.qLowerLimit)" label="下限">
            <tiny-input
v-model="createData.f_lowerLimit" placeholder="输入高度下限数值"
              :disabled="createData.baseType.split('-')[0] == 'SFC' || createData.baseType.split('-')[0] == 'GND' || act === 'edit'"
              @click="onFocusFG('F')"></tiny-input>
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="4">
          <!--上限-->
          <tiny-form-item v-if="!isEmpty(createData.qLowerLimit)" label="上限">
            <tiny-input
v-model="createData.g_upperLimit" placeholder="输入高度上限数值"
              :disabled="createData.baseType.split('-')[1] === 'UNL' || act === 'edit'"
              @click="onFocusFG('G')"></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
      <tiny-row class="guide-box2">
        <tiny-divider
content-position="left" offset="5%" font-size="20px" content-background-color="#1476ff"
          content-color="#ffffff">佐证材料</tiny-divider>
        <materials
:message-id="messageId" :template-i-d="templateID" :is-no-auth="isNoAuth" :act="act"
          @change-files="changeFiles">
        </materials>
      </tiny-row>
      <tiny-row class="guide-box4">
        <tiny-divider
content-position="left" offset="5%" font-size="20px" content-background-color="#1476ff"
          content-color="#ffffff">原始资料通知单以及预览</tiny-divider>
        <!--预览--->
        <tiny-col :span="12">
          <!--预览通知单-->
          <tiny-row><tiny-col :span="12">
              <exportMessage v-if="showNotice" :key="exportMessageKey" :form-data="createData" :act="'edit'" />
            </tiny-col></tiny-row>
          <!--序列号-->
          <tiny-form-item label="提供序列号">
            <tiny-input v-model="createData.notamSn" :disabled="act === 'edit'"></tiny-input>
          </tiny-form-item>
          <!--报文-->
          <!-- <tiny-form-item label="通告预览">
            <tiny-input v-model="createData.telegramText" type="textarea" autosize :disabled="act === 'edit'">
            </tiny-input>
          </tiny-form-item> -->
          <tiny-form-item label="通告预览">
            <tiny-input v-model="telegramTextWithoutFirstLine" type="textarea" autosize :disabled="act === 'edit'">
            </tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
      <tiny-form-item v-show="!isNoAuth">
        <tiny-button v-show="act == 'add'" type="primary" @click="onAssemble()">预览</tiny-button>
        <tiny-button
v-show="!isEmpty(createData.telegramText) && act == 'add'" type="primary"
          @click="onSend()">确认并开始上报流程</tiny-button>
        <tiny-button v-if="act === 'edit'" type="primary" @click="copyToClipboard()"> 将通告发布至通告系统 </tiny-button>
      </tiny-form-item>
    </tiny-form>
    <tiny-dialog-box
v-if="boxDVisibility" v-model:visible="boxDVisibility" :modal="false" append-to-body title="编辑分段时间"
      width="35%" :close-on-click-modal="false">
      <keep-alive>
        <schedulePicker @schedule-change="handleScheduleChange" @close="dialogClose" />
      </keep-alive>
    </tiny-dialog-box>
    <tiny-dialog-box
v-show="boxFVisibility" v-model:visible="boxFVisibility" :modal="false" append-to-body title="编辑F项"
      width="35%" :close-on-click-modal="false">
      <fgInput :base-type='baseType' :fg-type='fgType' @fg-change="changeFG" @close="dialogClose" />
    </tiny-dialog-box>
    <tiny-dialog-box
v-show="boxGVisibility" v-model:visible="boxGVisibility" :modal="false" append-to-body title="编辑G项"
      width="35%" :close-on-click-modal="false">
      <fgInput :base-type='baseType' :fg-type='fgType' @fg-change="changeFG" @close="dialogClose" />
    </tiny-dialog-box>
    <!--查看关联的源通告-->
    <tiny-dialog-box
v-if="workflowVisibility" v-model:visible="workflowVisibility" :modal="false" title="源通告"
      width="80%" max-height="1000px" top="5%" :close-on-click-modal="false">
      <exportMessage :form-data="messageFormData" :act="'detail'" />
    </tiny-dialog-box>
    <!--审批流程选择-->
    <tiny-dialog-box
v-if="boxDepartmentVisibility" v-model:visible="boxDepartmentVisibility" :modal="false"
      append-to-body title="原始资料上报流程" width="60%" :close-on-click-modal="false">
      <tiny-form label-width="150px">
        <tiny-form-item label="审批单位或领导：">
          <template #label>
            <tiny-tooltip type="info" content="审批单位或领导提供意见后方可继续" placement="top">
              <div>审批单位或领导：<tiny-icon-help-solid class="IconHelpSolid"></tiny-icon-help-solid></div>
            </tiny-tooltip>
          </template>
          <tiny-cascader
ref="cascaderLeaderRef" v-model="leaderNodes" :options="departmentTreeData"
            placeholder="请选择需要审批该通告的单位或领导，可多选" filterable clearable :props="{
              children: 'children',
              value: 'userID',
              label: 'userName',
              disabled: 'disabled',
              emitPath: false,
              multiple: true
            }" @change="onChangeLeaderNodeList"></tiny-cascader>
        </tiny-form-item>
        <tiny-form-item v-if="createData.needConsult == true" label="抄送单位或领导：">
          <template #label>
            <tiny-tooltip type="info" content="仅通知该单位或个人，无需其同意可继续进行流程" placement="top">
              <div>抄送单位或领导：<tiny-icon-help-solid class="IconHelpSolid"></tiny-icon-help-solid></div>
            </tiny-tooltip>
          </template>
          <tiny-cascader
ref="cascaderConsultationRef" v-model="consultationNodes" :options="departmentTreeData"
            placeholder="请选择需要知晓该通告的单位或领导，无需其审批" filterable clearable :props="{
              children: 'children',
              value: 'userID',
              label: 'userName',
              disabled: 'disabled',
              emitPath: false,
              multiple: true
            }" @change="onChangeConsultationNodeList"></tiny-cascader>
        </tiny-form-item>
        <tiny-form-item>
          <tiny-button type="primary" :disabled="leaderNodes.length === 0" @click="createProcess()">确定</tiny-button>
          <tiny-button type="info" @click="boxDepartmentVisibility = false">取消</tiny-button>
          <tiny-button
type="danger" style="margin-left: 300px;" :disabled="leaderNodes.length !== 0"
            @click="createProcess(false)">先送情报单位发布通告发布后审批,慎点</tiny-button>
        </tiny-form-item>
      </tiny-form>
    </tiny-dialog-box>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs, onMounted, watch, computed, h, withDefaults } from 'vue'
import {
  Collapse as TinyCollapse,
  CollapseItem as TinyCollapseItem,
  Form as TinyForm,
  FormItem as TinyFormItem,
  Row as TinyRow,
  Col as TinyCol,
  Input as TinyInput,
  Select as TinySelect,
  Option as TinyOption,
  Button as TinyButton,
  Modal,
  Loading,
  Notify,
  TinyRadioGroup, TinyRadioButton,
  TinyDatePicker,
  TinyOptionGroup,
  TinyDivider,
  DialogBox as TinyDialogBox,
  TinyGuide,
  TinyFloatbar,
  TinyCascader,
  TinyTooltip,
} from '@opentiny/vue'
import { queryAirPortAndAirSpace, queryAirPortConfig, queryAirSpaceConfig, queryMessageDetail, postMessage, queryUserTreeList, createWorkflow, fetchAutoGeneratedNotamSn, queryNaipSettings, type MessageVM } from '@/api/fetchInterface';
import formgenerator from '@/components/formgenerator/index.vue';
import schedulePicker from '@/components/schedulePicker/index.vue';
import fgInput from '@/components/fginput/index.vue';
import workflowaxios from '@/views/workflow/components/workflow-axios';
import { iconHelpSolid } from '@opentiny/vue-icon'

import { useUserStore } from '@/store';
import { isEmpty } from '@/utils/string-utils';
import exportMessage from './export.vue';
import materials from './materials.vue';

interface TemplateMatches {
  matchesOptionalLabel: string[];
  matchesRequiredLabel: string[];
  matchesOptionalKeyWord: string[];
  matchesRequiredKeyWord: string[];
}

interface WorkflowNode {
  id: number | string;
  type: string;
  name: string;
  parentId: number;
}

interface CascaderCheckedNode {
  value: number | string;
  label: string;
  parent: { value: number };
}

interface MaterialItem {
  title: string;
  fileList: Array<{ id: number }>;
}

interface AOptionGroup {
  label: string;
  options: Array<{ label: string; value: string }>;
}

interface ValidTypeOption {
  text: string;
  label: string;
}

interface CreateDataForm {
  templateID: number | null;
  template: string;
  example: string;
  picturePath: string;
  state: string;
  remark: string;
  needConsult: boolean;
  messageType: string;
  messageId: string;
  parentId: number;
  validType: string;
  baseType: string;
  qAirSpace: string;
  qCode: string;
  qFlightType: string;
  qTarget: string;
  qReach: string;
  qLowerLimit: string;
  qUpperLimit: string;
  qLat: string;
  qLong: string;
  qRadius: string;
  circumstances: string;
  /* NOTAM 报文字段名，与后端保持一致 */
  /* eslint-disable camelcase */
  a_airSpace: string;
  d_time: string;
  e_data: string;
  f_lowerLimit: string;
  g_upperLimit: string;
  h_coordinate: string;
  /* eslint-enable camelcase */
  startTime: string;
  endTime: string;
  telegramText: string;
  notamSn: string;
  aftnSn: string;
  specialNotes: string;
  isImmediate: boolean;
}

interface EFormData {
  requiredList: string[];
  optionalList: string[];
  result: string;
}

interface AssembleFormProps {
  templateID?: number;
  templateData?: Partial<CreateDataForm> | Record<string, unknown>;
  messageId?: number;
  parentId?: number;
  isNoAuth?: boolean;
  act?: string;
  messageType?: string;
}

interface AssembleMessagePayload {
  qCode: string;
  airSpaceCodeId: string;
  type: string;
  validType: string;
  lat: string;
  long: string;
  radius: string;
  telegramText: string;
  startTime: string;
  endTime: string;
  specialNotes: string;
  notamSn: string;
  isImmediate: boolean;
  templateId?: number;
  workflowId?: number;
  parentId?: number;
  messageId?: number;
  materials?: Array<{ fileId: number; materialType: string }>;
}

interface FormGeneratorExpose {
  assembleStr: () => Record<string, string>;
}

interface CascaderExpose {
  getCheckedNodes: (leafOnly: boolean) => CascaderCheckedNode[];
}

function createEmptyTemplateMatches(): TemplateMatches {
  return {
    matchesOptionalLabel: [],
    matchesRequiredLabel: [],
    matchesOptionalKeyWord: [],
    matchesRequiredKeyWord: [],
  };
}

const TELEGRAM_ITEM_REGEX = /[A-G]\)(.*?)(?=[A-G]\)|[\r\n]|$)/gm;
const AIRSPACE_CONFIG_TYPES = [
  { key: 'ndbs', prefix: 'ndbs' },
  { key: 'restricteds', prefix: 'restricteds' },
  { key: 'vors', prefix: 'vors' },
  { key: 'controlleds', prefix: 'controlleds' },
];
const AIRPORT_CONFIG_TYPES = [
  { key: 'rwys', prefix: 'rwys' },
  { key: 'rwyDirections', prefix: 'rwyDirections' },
];

type TelegramItemKey = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
type TelegramItems = Record<TelegramItemKey, string>;

function parseTelegramItems(telegramText: string): TelegramItems {
  const result = {} as TelegramItems;
  const matches = Array.from(telegramText.matchAll(TELEGRAM_ITEM_REGEX));
  matches.forEach((match) => {
    const letter = match[0].split(')')[0];
    if (letter.length === 1 && letter >= 'A' && letter <= 'G') {
      result[letter as TelegramItemKey] = (match[1] || '').trim();
    }
  });
  return result;
}

function buildCText(validType: string, messageType: string, endTime: string): string {
  if (validType === 'PERM' && messageType === '新发报文') {
    return 'PERM';
  }
  if (validType === 'PERM' && messageType !== '新发报文') {
    return '';
  }
  if (validType === 'EST') {
    return `${endTime || ''} EST`;
  }
  return `${endTime || ''}`;
}

function mapCascaderNodes(checkVal: CascaderCheckedNode[]): WorkflowNode[] {
  return checkVal.map((item) => ({
    id: item.value,
    type: 'user',
    name: item.label,
    parentId: item.parent.value,
  }));
}

function uniqueByProperty<T extends Record<string, unknown>>(array: T[], key: keyof T & string) {
  const seen = new Set();
  return array.filter((item) => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

function createConfigItem<T extends Record<string, unknown>>(data: T[], key: keyof T & string): { value: string; label: string }[] {
  return uniqueByProperty(data, key).map((item) => ({
    value: String(item[key]),
    label: String(item[key]),
  }));
}

function processConfig(dataArray: Record<string, unknown>[], prefix: string) {
  const config: Record<string, unknown> = {};
  const configKeys = [...new Set(dataArray.flatMap(Object.keys))];
  configKeys.forEach((key) => {
    const configKey = `${prefix}${key}`;
    const items = createConfigItem(dataArray, key);
    config[configKey] = items.length === 1 ? items[0]?.value : items;
  });
  return config;
}

function mergeEntityConfig(
  data: Record<string, unknown>,
  configTypes: { key: string; prefix: string }[],
  target: Record<string, unknown>,
) {
  const mergedConfig = configTypes.reduce<Record<string, unknown>>((acc, { key, prefix }) => {
    const sectionData = data[key];
    if (Array.isArray(sectionData)) {
      return Object.assign(acc, processConfig(sectionData as Record<string, unknown>[], prefix));
    }
    return acc;
  }, {});
  Object.assign(target, mergedConfig);
  Object.keys(data).forEach((key) => {
    if (typeof data[key] !== 'object') {
      target[key] = String(data[key]);
    }
  });
}

const TinyIconHelpSolid = iconHelpSolid()

const userStore = useUserStore();
const childRef = ref<FormGeneratorExpose>();
const preCondition = ref(false);
const props = withDefaults(defineProps<AssembleFormProps>(), {
  isNoAuth: false,
});
const { templateID, templateData, parentId, messageId, act, messageType } = toRefs(props);
// 会商部门/审批部门
const cascaderLeaderRef = ref<CascaderExpose>();
const cascaderConsultationRef = ref<CascaderExpose>();
const departmentTreeData = ref<Record<string, unknown>[]>([]);
const leaderNodes = ref<Array<number | string>>([]);
const consultationNodes = ref<Array<number | string>>([]);
const consultationNodeList = ref<WorkflowNode[]>([]);
const leaderNodeList = ref<WorkflowNode[]>([]);
const materialList = ref<MaterialItem[]>([]);
const materialCount = ref(0);


const exportMessageKey = ref(0);

// 视角变量
const view = ref(false);
// 引导变量
const showStep = ref(false);
const domData = ref([
  {
    title: '需要发布的通告类型',
    text: '请先选择通告类型,Q项内容无需填写(在A项填写后将自动填充)',
    domElement: '.guide-box1',
    button: [
      {
        text: '下一步',
        action: 'next'
      }
    ]
  },
  {
    title: '发生地与生效期',
    text: '发生地只能单选机场或者情报区,填写后自动填充Q项,生效期',
    domElement: '.guide-box2',
    button: [
      {
        text: '上一步',
        action: 'back',
        secondary: true
      },
      {
        text: '下一步',
        action: 'next'
      },
    ]
  },
  {
    title: '原始资料内容及影响范围',
    text: 'E项会根据A项内容自动生成,请根据实际情况填写E项',
    domElement: '.guide-box3',
    button: [
      {
        text: '上一步',
        action: 'back',
        secondary: true
      },
      {
        text: '下一步',
        action: 'next'
      },
    ]
  },
  {
    title: '原始资料通知单以及预览',
    text: '点击按钮将预览(无收发电地址)',
    domElement: '.guide-box4',
    button: [
      {
        text: '上一步',
        action: 'back',
        secondary: true
      },
      {
        text: '下一步',
        action: 'next'
      },
      {
        text: '完成',
        action: 'complete'
      }
    ]
  }
])
// pdf变量
const floatSize = ref("width:20%;height:450px;top:10%");
let pdfSize = ref("width:100%;height:400px;top:10%");
const pdfState = ref("放大");
// 机场、情报区数据
const staticData = ref<Record<string, unknown>>({});
const createData = reactive<CreateDataForm>({
  templateID: null,
  template: '',
  example: '',
  picturePath: '',
  state: '',
  remark: '',
  needConsult: false,
  // 通告类型
  messageType: '新发报文',
  // 通告号
  messageId: '',
  parentId: 0,
  // 报文生效类型
  validType: 'NEITHER',
  // F/G项的基准面
  baseType: "",
  // Q项
  qAirSpace: "",
  qCode: '',
  qFlightType: '',
  qTarget: '',
  qReach: '',
  qLowerLimit: '',
  qUpperLimit: '',
  qLat: '',
  qLong: '',
  qRadius: '',
  circumstances: '',
  // A项
  a_airSpace: '',
  // B项
  startTime: '',
  // C项
  endTime: '',
  // D项
  d_time: '',
  // E项
  e_data: '',
  // F项
  f_lowerLimit: '',
  // G项
  g_upperLimit: '',
  // H项
  h_coordinate: '',
  // 电报正文
  telegramText: '',
  // 提供序列号
  notamSn: '',
  // 通告序列号
  aftnSn: '',
  // 通知单特殊说明
  specialNotes: '',
  // 是否立即生效
  isImmediate: false,
});

const handleScheduleChange = (rule: string) => {
  createData.d_time = rule;
};

// 基准面
const baseType = ref<string>('');
// 弹窗的f/g的类型
const fgType = ref<string>('');
// 折叠变量
const activeNames = ref(['示例', '必填项', '选填项'])
// 情报区四字码
const airSpaceCodes = ref(["ZGZU", "ZHWH", "ZJSA",]);
// e项的组装数据
const eFormData = reactive<EFormData>({
  requiredList: [],
  optionalList: [],
  result: '',
});
// 整个弹窗的规则
const rules = ref({
  radio: [{ required: true, message: '必填', trigger: 'change' }],
})
// A项选项
const aOptions = ref<AOptionGroup[]>([{
  label: '飞行情报区',
  options: [{ label: "", value: "", }]
},
{
  label: '机场',
  options: [{ label: "", value: "", }]
}]);
// D项弹窗显示变量
const boxDVisibility = ref(false)
// FG项弹窗显示变量
const boxFVisibility = ref(false)
const boxGVisibility = ref(false)
const boxDepartmentVisibility = ref(false);

// 关联通告弹窗显示变量
const workflowVisibility = ref(false);
const messageFormData = reactive<Record<string, unknown>>({});

// 通告类型
const messageTypeOption = ref<string[]>(['新发报文', '代替现有报文', '取消现有报文']);
// 报文有效期类型
const messageValidTypeOption = ref<ValidTypeOption[]>([
  { text: '有确切的结束时间', label: 'NEITHER' },
  { text: '永久有效', label: 'PERM' },
  { text: '无法准确设定，只能预计', label: 'EST' },
]);
// 基准面类型
const baseTypeOption = ref({
  height: 400,
  data: [
    { fBase: 'SFC(从表面)', gBase: "UNL(无限高)", fg: "SFC-UNL" },
    { fBase: 'GND(从地面)', gBase: "UNL(无限高)", fg: "GND-UNL" },
    { fBase: 'SFC(从表面)', gBase: 'XXX M AMSL(从平均海平面)', fg: "SFC-XXX M AMSL" },
    { fBase: 'GND(从地面)', gBase: 'XXX M AGL(从机场平面)', fg: "GND-XXX M AGL" },
    { fBase: 'XXX M AGL(从机场平面)', gBase: 'XXX M AGL(从机场平面)', fg: "XXX M AGL-XXX M AGL" },
    { fBase: 'XXX M AMSL(从平均海平面)', gBase: 'XXX M AMSL(从平均海平面)', fg: "XXX M AMSL-XXX M AMSL" },
    { fBase: 'FL XXX(飞行高度)', gBase: "FL XXX(飞行高度)", fg: "FL XXX-FL XXX" },
  ],
  columns: [
    { type: 'radio', title: '', width: "10%" },
    { field: 'fBase', title: '从', width: 220 },
    { field: 'gBase', title: '到', width: 220 },
    //{ field: 'fg', title: '', hidden: true },
  ]
});
const keyWord = ref<string>('');
const keyWordLabel = ref<string[]>([]);
// 定义派发事件
const emit = defineEmits(['close', 'createMessage']);
// 加载效果
const state = reactive<{
  loading: ReturnType<typeof Loading.service> | null;
}>({
  loading: null,
});

const messageData = reactive<AssembleMessagePayload>({
  qCode: '',
  airSpaceCodeId: '',
  type: '',
  validType: '',
  lat: '',
  long: '',
  radius: '',
  telegramText: "",
  startTime: "",
  endTime: "",
  specialNotes: "",
  notamSn: "",
  isImmediate: false,
});
const showNotice = ref(false);

const naipDataPeriodOptions = ref<unknown[]>([]);
const naipDataPeriod = ref('');

watch(
  () => createData.a_airSpace,
  (newVal: string, oldVal: string) => {
    if (newVal && newVal !== oldVal && act.value === "add") {
      onChangeA()
    }
  },
  {
    immediate: true,  // 保持初始化时触发
    // deep: true 不需要，因为 a_airSpace 是 string 类型
  }
)
// 初始化请求数据
onMounted(async () => {
  if (templateID.value) {
    fetchData();
  }
  await queryNaipOptions()
  if (isEmpty(messageId.value) && messageType.value === "cnl") {
    createData.messageType = "取消现有报文"
    onChangeMessageType()
  }
  else if (isEmpty(messageId.value) && messageType.value === "replace") {
    createData.messageType = "代替现有报文"
    onChangeMessageType()
  }
  if (!isEmpty(parentId.value)) {
    createData.parentId = parentId.value ?? 0;
  }
  if (act.value === "add") {
    // 获取自动生成的提供序列号，并且填写到提供序列号中
    await getAutoGeneratedNotamSn();
  }
  // 用户只会发自己情报区的电报
  createData.qAirSpace = userStore.airSpaceCodeId || "";
});

const handleMessage = async () => {
  if (messageId?.value === null) {
    return;
  }
  const { data } = await queryMessageDetail({ id: messageId?.value });
  createData.a_airSpace = data.airSpaceCodeId;
  createData.messageType = data.type;
  createData.validType = data.validType;
  createData.qLat = data.lat;
  createData.qLong = data.long;
  createData.qRadius = data.radius;
  createData.telegramText = data.telegramText;
  createData.templateID = data.templateId;
  createData.parentId = data.parentId;
  if (!isEmpty(data.startTime)) {
    createData.startTime = data.startTime;
    createData.endTime = data.endTime;
  }
  createData.isImmediate = data.isImmediate;

  const result = parseTelegramItems(data.telegramText);
  createData.startTime = result.B;
  createData.endTime = result.C;
  createData.d_time = result.D;
  createData.e_data = result.E;
  createData.f_lowerLimit = result.F;
  createData.g_upperLimit = result.G;
}
// A项（情报区/机场）的静态数据获取
const fetchAirPortAndAirSpace = async () => {
  state.loading = Loading.service({
    text: 'loading...',
    target: document.getElementById('container'),
    background: 'rgba(0, 0, 0, 0.7)',
  });
  try {
    const { data } = await queryAirPortAndAirSpace({ qReach: createData.qReach });
    aOptions.value = data as AOptionGroup[];
    if (createData.qReach === 'E' || createData.qReach === 'W') {
      createData.a_airSpace = userStore.airSpaceCodeId || '';
    }
    else {
      createData.a_airSpace = userStore.airPortCodeId || '';
    }
  }
  catch (err) {
    Modal.alert('获取数据错误');
    emit('close', false);
  }
  finally {
    state.loading?.close();
  }
}
// 请求数据接口方法
const fetchData = async () => {
  Object.assign(createData, templateData.value ?? {});
  handleKeyWord();
  if (act.value === 'add') {
    // 加了handleMessage，不知道有没有影响，如果不加，那么parentId等数据不能导入
    handleMessage();
    await fetchAirPortAndAirSpace();
  }
  else {
    handleMessage();
  }
  preCondition.value = true;
};
function successClick() {
  Notify({
    type: 'success',
    message: '复制到剪贴板成功',
    position: 'top-right'
  })
}
function errorClick(err: unknown) {
  Notify({
    type: 'error',
    message: err instanceof Error ? err.message : String(err),
    position: 'top-right'
  })
}
// 核心算法，提取关键字
function extractContent(input: string): TemplateMatches {
  const regexOptionalLabel = /\$([^$]+)\$\{/g;
  const regexRequiredLabel = /\$([^$]+)\$\【/g;
  const regexOptionalKeyWord = /\$\{([^}]+)\}/g;
  const regexRequiredKeyWord = /\$\【([^】]+)\】/g;
  const matchesOptionalLabel: string[] = [];
  const matchesRequiredLabel: string[] = [];
  const matchesOptionalKeyWord: string[] = [];
  const matchesRequiredKeyWord: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = regexOptionalLabel.exec(input))) {
    matchesOptionalLabel.push(match[1]);
  }
  while ((match = regexRequiredLabel.exec(input))) {
    matchesRequiredLabel.push(match[1]);
  }
  while ((match = regexOptionalKeyWord.exec(input))) {
    matchesOptionalKeyWord.push(match[1]);
  }
  while ((match = regexRequiredKeyWord.exec(input))) {
    matchesRequiredKeyWord.push(match[1]);
  }
  eFormData.requiredList = Array.from({ length: matchesRequiredLabel.length }, () => '');
  eFormData.optionalList = matchesOptionalLabel.map((_, index) => matchesOptionalKeyWord[index] ?? '');
  keyWord.value = matchesRequiredKeyWord.join(',');
  keyWordLabel.value = matchesRequiredLabel;
  return { matchesOptionalLabel, matchesRequiredLabel, matchesOptionalKeyWord, matchesRequiredKeyWord };
}
const matches = reactive<TemplateMatches>(createEmptyTemplateMatches());
// 提取关键字事件
const handleKeyWord = () => {
  Object.assign(matches, extractContent(createData.template));
}
// 复制到粘贴板
async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(eFormData.result);
    successClick();
  } catch (err) {
    errorClick(err)
  }
}
// 组装事件
async function onAssemble() {
  showNotice.value = false;
  const test = childRef.value?.assembleStr();
  if (!test) {
    return;
  }
  eFormData.requiredList = Object.values(test);
  // 校验其他项---后续要做在formitem中
  // 新发报文代替现有报文必须要有b、c项
  // c项的末尾必须不是0000
  // 事件生效时间必须小于事件失效时间
  // NEITHER必须填B、C项
  // 代替报和取消报的生效时间为当前时间，失效时间是取消报为无，代替报为可选
  if ((createData.validType !== 'PERM' && createData.validType !== '') && (isEmpty(createData.startTime) || isEmpty(createData.endTime))) {
    Modal.alert('请填写事件生效时间和事件失效时间');
    return;
  }
  if ((createData.validType !== 'PERM' && createData.validType !== '') && createData.endTime.includes('0000')) {
    Modal.alert('事件失效时间的时分不能为00:00');
    return;
  }
  if ((createData.validType !== 'PERM' && createData.validType !== '') && createData.endTime < createData.startTime) {
    Modal.alert('事件失效时间不能大于事件生效时间');
    return;
  }
  if ((createData.validType === 'PERM' || createData.validType === '') && isEmpty(createData.startTime)) {
    Modal.alert('请填写事件生效时间');
    return;
  }
  // 新发报文代替现有报文必须要有b、c项
  if ((createData.messageType === "新发报文" || createData.messageType === "代替现有报文") && (isEmpty(createData.startTime) || isEmpty(createData.endTime)) && createData.validType === '') {
    Modal.alert('请填写事件生效时间和事件失效时间');
    return;
  }
  // 校验E项中的必填项是否都填完,由于有一些必填项自带了文本，因此需要进一步判断--todo
  if (eFormData.requiredList.length > 0 && eFormData.requiredList.every((item: string) => typeof item === 'undefined' || item.includes("undefined") || item.includes('null'))) {
    Modal.alert('请填写必填项');
    return;
  }



  let assembleText = createData.template;
  matches.matchesRequiredLabel.forEach((item, index) => {
    assembleText = assembleText.replace(`$${item}$【${matches.matchesRequiredKeyWord[index]}】`, eFormData.requiredList[index]);
  });
  matches.matchesOptionalLabel.forEach((item, index) => {
    assembleText = assembleText.replace(`$${item}$\{${matches.matchesOptionalKeyWord[index]}\}`, `${eFormData.optionalList[index]}`);
  });
  // E项组装的文本
  eFormData.result = assembleText;
  let qText = `Q)${createData.qAirSpace}/${createData.qCode}/${createData.qFlightType}/${createData.qTarget}/${createData.qReach}/${createData.qLowerLimit}/${createData.qUpperLimit}/${createData.qLat}${createData.qLong}${createData.qRadius}`;
  let cText = buildCText(createData.validType, createData.messageType, createData.endTime);
  if (createData.validType === "PERM" && createData.messageType === "新发报文") {
    createData.endTime = "PERM";
  }
  let abcText = `A)${createData.a_airSpace} B)${createData.startTime || ''} ${isEmpty(cText) ? '' : `C)${cText}`}`;
  //let abcText = `A)${createData.a_airSpace} B)${createData.startTime || ''} C)${createData.validType === "NEITHER" ? createData.validType : createData.endTime || ''}`;
  let dText = isEmpty(createData.d_time) ? "" : `\nD)${createData.d_time}`;
  let eText = `E)${eFormData.result}`;
  let fgText = "";
  // 如果F、G项为空时，F\G项为空字符串
  if (!isEmpty(createData.qLowerLimit) && (createData.f_lowerLimit || createData.g_upperLimit)) {
    fgText = `\nF)${createData.f_lowerLimit} G)${createData.g_upperLimit}`
  }
  createData.telegramText = `${qText}\n${abcText}${dText}\n${eText}${fgText}`;
  createData.e_data = eText
  // 获取自动生成的提供序列号，并且填写到提供序列号中
  if (isEmpty(createData.notamSn)) {
    await getAutoGeneratedNotamSn();
  }
  // 更新 key 强制组件重新渲染
  exportMessageKey.value += 1;
  showNotice.value = true;
}


async function onSend() {
  let prefix1 = ''
  let prefix2 = ''
  if (isEmpty(createData.notamSn)) {
    prefix1 = '提供序列号为空！如不填入，将使用系统自动生成的序列号！'
  }
  if (materialCount.value === 0) {
    prefix2 += '未上传佐证材料!请核实是否不需要上传佐证材料？'
  }

  let confirmText = h('div', [
    h('span', { style: 'color: #f00;font-size: 18px;' }, prefix1),
    prefix1 === '' ? '' : h('br'),
    prefix1 === '' ? '' : h('br'),
    h('span', { style: 'color: #f00;font-size: 18px;' }, prefix2),
    prefix2 === '' ? '' : h('br'),
    prefix2 === '' ? '' : h('br'),
    h('span', { style: 'font-size: 18px; color: #666;' }, '点确认将开始上报流程，确定后将无法修改！点取消将返回编辑！')
  ])
  Modal.confirm({ title: '请注意！', message: confirmText }).then(async (res: string) => {
    if (res === 'confirm') {
      messageData.qCode = createData.qCode;
      messageData.airSpaceCodeId = createData.qAirSpace;
      messageData.type = createData.messageType;
      messageData.validType = createData.validType;
      messageData.lat = createData.qLat;
      messageData.long = createData.qLong;
      messageData.radius = createData.qRadius;
      messageData.telegramText = createData.telegramText;
      messageData.templateId = templateID.value;
      messageData.startTime = createData.startTime;
      messageData.endTime = createData.endTime;
      messageData.specialNotes = createData.specialNotes;
      messageData.notamSn = createData.notamSn;
      messageData.parentId = createData.parentId;
      messageData.isImmediate = createData.isImmediate;
      // 代替取消报要记录parentid
      if (messageType.value === 'replace' || messageType.value === 'cnl') {
        messageData.parentId = parentId.value;
      }
      else {
        messageData.parentId = createData.parentId;
      }
      if (!isEmpty(messageId)) {
        messageData.messageId = messageId.value;
      }
      ////messageData.materials = [{ fileId: 87, materialType: "测试1" }];
      messageData.materials = [];
      materialList.value.forEach((item) => {
        if (item.fileList?.length > 0) {
          messageData.materials?.push({ fileId: item.fileList[0].id, materialType: item.title });
        }
      });
      await postMessage(messageData as unknown as MessageVM).then((res1: { code: number; data: number }) => {
        if (res1.code === 200) {
          Modal.message({ message: '发送成功', status: 'success' })
          messageId.value = res1.data;
          emit('createMessage', res1.data, messageData);
          onNotice();
        }
      }).catch(() => {
        // postMessage 错误由 axios 拦截器统一处理
      });
    }
  })
}
const onChangeLeaderNodeList = () => {
  const checkVal = cascaderLeaderRef.value?.getCheckedNodes(true) ?? [];
  leaderNodeList.value = mapCascaderNodes(checkVal);
}
const onChangeConsultationNodeList = () => {
  const checkVal = cascaderConsultationRef.value?.getCheckedNodes(true) ?? [];
  consultationNodeList.value = mapCascaderNodes(checkVal);
}

// 生成通知单事件
async function onNotice() {
  // 获取所有通知单列表
  // 弹出选择框（选择对应的部门）
  const { data } = await queryUserTreeList();
  departmentTreeData.value = data.children;
  if (createData.needConsult) {
    boxDepartmentVisibility.value = true;
  }
  // 没有会商需求就直接自动生成
  else {
    createProcess();
  }
}
// 创建流程
const createProcess = async (neddConsult = true) => {
  // 判断是否需要原始资料单位领导审批
  if (neddConsult && leaderNodeList.value.map(item => item.id).join(",").length === 0) {
    Modal.alert('请填写审批单位');
    return
  }
  let vm = {
    messageId: messageId.value,
    templateId: messageData.templateId,
    leaderNodes: leaderNodeList.value.map(item => item.id).join(","),
    consultationNodes: consultationNodeList.value.map(item => item.id).join(","),
    leaderParentNodes: [...new Set(leaderNodeList.value.map(node => node.parentId))].map(id => id / 10000).join(','),
    consultationParentNodes: [...new Set(consultationNodeList.value.map(node => node.parentId))].map(id => id / 10000).join(','),
    authUserId: workflowaxios.defaults.headers.common.AuthUserId,
    authorization: workflowaxios.defaults.headers.common.Authorization,
    flyflowTenantId: workflowaxios.defaults.headers.common.FlyflowTenantId || "1"

  }
  await createWorkflow(vm).then((res1: any) => {
    if (res1.code === 200) {
      Modal.message({ message: '发送成功', status: 'success' })
      boxDepartmentVisibility.value = false;
      emit('close', true);
    }
  }).catch(() => {
    // createWorkflow 错误由 axios 拦截器统一处理
  });
};
// 为了满足空管部隐藏Q项的需求
// 计算属性：返回去掉第一行后的文本
const telegramTextWithoutFirstLine = computed({
  get() {
    if (!createData.telegramText) return ''

    // 将文本按行分割
    const lines = createData.telegramText.split('\n')

    // 去掉第一行，然后重新组合
    if (lines.length > 1) {
      return lines.slice(1).join('\n')
    }

    // 如果只有一行，返回空字符串
    return ''
  },
  set(value) {
    // 获取原始的第一行
    const originalLines = (createData.telegramText || '').split('\n')
    const firstLine = originalLines.length > 0 ? originalLines[0] : ''

    // 使用模板字符串重新组合：第一行 + 新的内容
    createData.telegramText = `${firstLine}${value ? `\n${value}` : ''}`
  }
})

// A-E、Q。A项改变事件，触发了静态数据变化。只有A项和Q项可以触发静态数据变化
async function onChangeA() {
  if (airSpaceCodes.value.includes(createData.a_airSpace)) {
    const { data } = await queryAirSpaceConfig({ id: createData.a_airSpace });
    createData.qLat = "";
    createData.qLong = "";
    if (data) {
      mergeEntityConfig(data, AIRSPACE_CONFIG_TYPES, staticData.value);
    } else {
      staticData.value = {};
    }
    return;
  }

  const { data } = await queryAirPortConfig({ id: createData.a_airSpace });
  if (data) {
    createData.qLat = data.geoLat;
    createData.qLong = data.geoLong;
    mergeEntityConfig(data, AIRPORT_CONFIG_TYPES, staticData.value);
  } else {
    createData.qLat = "";
    createData.qLong = "";
    staticData.value = {};
  }
}
function onChangeB() {
  if (createData.startTime === getCurrentFormattedTime()) {
    createData.isImmediate = true;
  }
  else {
    createData.isImmediate = false
  }
}
// D项点击事件
function onFocus() {
  boxDVisibility.value = true;
}
// 弹窗关闭事件
function dialogClose() {
  boxDVisibility.value = false;
  boxFVisibility.value = false;
  boxGVisibility.value = false;
  boxDepartmentVisibility.value = false;
  workflowVisibility.value = false;
  fgType.value = "";
}
// FG项弹窗打开事件
function onFocusFG(data: string) {
  const [f, g] = createData.baseType.split("-")
  if (data === 'F') {
    baseType.value = f
    fgType.value = 'F';
    boxFVisibility.value = true;
  }
  else {
    baseType.value = g
    fgType.value = 'G';
    boxGVisibility.value = true;
  }
}
// FG改变事件,回传值并且更新Q项的上下限
const changeFG = (type: string, data: string, fl: string) => {
  if (type === 'F') {
    createData.f_lowerLimit = data;
    createData.qLowerLimit = fl;
  }
  else if (type === 'G') {
    createData.g_upperLimit = data;
    createData.qUpperLimit = fl;
  }
}
// 上下限改变时，触发FG项改变事件
function onChangeBaseType() {
  // 基准面选择事件-规范F、G的选项
  let fBase = createData.baseType.split("-")[0];
  let gBase = createData.baseType.split("-")[1];
  // 这些情况下，F、G项无需编辑，并且自动修改Q项的值
  if (fBase === "SFC" || fBase === "GND") {
    createData.f_lowerLimit = fBase;
    createData.qLowerLimit = "000";
  }
  else {
    createData.f_lowerLimit = "";
    createData.qLowerLimit = "";
  }
  if (gBase === "UNL") {
    createData.g_upperLimit = gBase;
    createData.qUpperLimit = "999";
  }
  else {
    createData.g_upperLimit = "";
    createData.qUpperLimit = "";
  }
}
// 改变通告类型事件
function onChangeMessageType() {
  messageValidTypeOption.value.push({ text: '立即生效', label: '' })
  // 代替报和取消报的b项为当前时间，c项为空
  if (createData.messageType === "代替现有报文" || createData.messageType === "取消现有报文") {
    createData.startTime = getCurrentFormattedTime();
    createData.endTime = "";
    createData.validType = "";
  }
}
function getCurrentFormattedTime() {
  const date = new Date();

  // 辅助函数：补零到两位
  const padZero = (num: number) => num.toString().padStart(2, '0');

  // 提取各时间部分并处理
  const year = date.getFullYear().toString().slice(-2); // 后两位年份
  const month = padZero(date.getMonth() + 1); // 月份（0-11 → 1-12）
  const day = padZero(date.getDate()); // 日期
  const hour = padZero(date.getHours()); // 小时
  const minute = padZero(date.getMinutes()); // 分钟

  // 拼接成目标格式
  return `${year}${month}${day}${hour}${minute}`;
}

// 引导按钮事件
function stepStart() {
  showStep.value = !showStep.value
}
// 切换视角
function onChangeView() {
  view.value = !view.value
}
// 查看源通告
const onRead = async () => {
  try {
    const { data: detailData } = await queryMessageDetail({ id: createData.parentId });
    Object.assign(messageFormData, detailData);
    workflowVisibility.value = true;
  }
  catch (err) {
    Modal.alert('获取数据错误');
  }
}

// 放大缩小PDF
function onResizePdf() {
  if (pdfState.value === "缩小") {
    floatSize.value = "width:20%;height:450px;top:10%";
    pdfSize.value = "width:100%;height:400px;top:10%";
    pdfState.value = "放大";
  }
  else if (pdfState.value === "放大") {
    floatSize.value = "width:90%;height:90vh;top:5%;left:5%";
    pdfSize.value = "width:100%;height:90vh;top:5%;left:5%";
    pdfState.value = "缩小";
  }
}

// 材料列表更新函数
const changeFiles = (files: MaterialItem[]) => {
  materialList.value = files;
  materialCount.value = 0;
  materialList.value.forEach(item => {
    if (!isEmpty(item) && !isEmpty(item.fileList) && item.fileList.length > 0) {
      materialCount.value += item.fileList.length;
    }
  })
}
// 获取自动生成的提供序列号
const getAutoGeneratedNotamSn = async () => {
  const { data } = await fetchAutoGeneratedNotamSn();
  if (!isEmpty(data)) {
    createData.notamSn = data;
  }
}

const queryNaipOptions = async () => {
  const { data } = await queryNaipSettings();
  Object.assign(naipDataPeriodOptions.value, data);
}


</script>

<style scoped lang="less">
.demo-collapse-wrap {
  .tiny-form-item {
    margin-bottom: 10px;
  }
}
</style>