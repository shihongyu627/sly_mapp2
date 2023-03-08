<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<!-- 修改用户名 -->
		<view v-if="indent == 'username'" class="edit-info">
			<view class="edit-info-box">
				<text class="info-name">{{ $lang('username') }}</text>
				<input class="uni-input info-content input-len" type="text" maxlength="30" :placeholder="$lang('usernamePlaceholder')" v-model="formData.username" />
			</view>
			<view class="color-tip font-size-goods-tag set-pass-tips">用户名仅可修改一次，请谨慎设置</view>
			<view class="save-item" @click="save('username')">
				<button type="primary">{{ $lang('save') }}</button>
			</view>
		</view>
		<!-- 修改昵称 -->
		<view v-if="indent == 'name'" class="edit-info">
			<view class="edit-info-box">
				<text class="info-name">{{ $lang('nickname') }}</text>
				<input class="uni-input info-content input-len" type="text" maxlength="30" :placeholder="$lang('nickPlaceholder')" v-model="formData.nickName" />
			</view>
			<view class="save-item" @click="save('name')">
				<button type="primary">{{ $lang('save') }}</button>
			</view>
		</view>
		<!-- 修改真实姓名 -->
		<view v-if="indent == 'realName'" class="edit-info">
			<view class="edit-info-box">
				<text class="info-name">{{ $lang('realName') }}</text>
				<input class="uni-input info-content input-len" type="text" maxlength="30" :placeholder="$lang('pleaseRealName')" v-model="formData.realName" />
			</view>
			<view class="save-item" @click="save('realName')">
				<button type="primary">{{ $lang('save') }}</button>
			</view>
		</view>
		<!-- 修改性别 -->
		<view v-if="indent == 'sex'" class="edit-info">
			<view class="edit-info-box">
				<text class="info-name">{{ $lang('sex') }}</text>
				<radio-group @change="radioChange" class="edit-sex-list">
					<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in items" :key="item.value">
						<view>
							<radio :color="themeStyle.main_color" :value="item.value" :checked="index === formData.sex" />
						</view>
						<view>{{ item.name }}</view>
					</label>
				</radio-group>
			</view>
			<view class="save-item" @click="save('sex')">
				<button type="primary">{{ $lang('save') }}</button>
			</view>
		</view>
		<!-- 修改生日 -->
		<view v-if="indent == 'birthday'" class="edit-info edit-birthday-list">
			<view class="edit-info-box">
				<text class="info-name">{{ $lang('birthday') }}</text>
				<picker mode="date" :value="formData.birthday" :start="startDate" :end="endDate" @change="bindDateChange">
					<view class="uni-input">{{ formData.birthday ? formData.birthday : '请选择生日' }}</view>
				</picker>
			</view>
			<view class="save-item" @click="save('birthday')">
				<button type="primary">{{ $lang('save') }}</button>
			</view>
		</view>
		<!-- 修改密码 -->
		<view v-if="indent == 'password'" class="edit-info">
			<block v-if="memberInfo.password == 0 && memberInfo.mobile == ''">
				<view class="empty">
					<view class="empty_img"><image :src="$util.img('public/uniapp/common/common-empty.png')" mode="aspectFit"></image></view>
					<view class="color-tip margin-top margin-bottom">请先绑定手机再执行该操作</view>
					<button type="primary" size="mini" class="button color-base-bg" @click="modifyInfo('mobile')">立即绑定</button>
				</view>
			</block>
			<block v-else>
				<view class="edit-info-box" v-if="memberInfo.password">
					<text class="info-name">{{ $lang('nowPassword') }}</text>
					<input class="uni-input info-content input-len" type="password" maxlength="30" :placeholder="$lang('nowPassword')" v-model="formData.currentPassword" />
				</view>
				<block v-else>
					<view class="edit-info-box">
						<text class="info-name">{{ $lang('confirmCode') }}</text>
						<input class="uni-input info-content" type="number" maxlength="4" :placeholder="$lang('confirmCode')" v-model="formData.mobileVercode" />
						<image :src="captcha.img" class="captcha" @click="getCaptcha"></image>
					</view>
					<view class="edit-info-box">
						<text class="info-name">{{ $lang('animateCode') }}</text>
						<input class="uni-input info-content" type="number" maxlength="6" :placeholder="$lang('animateCode')" v-model="formData.mobileDynacode" />
						<button type="primary" class="dynacode" @click="passwordMoblieCode()">{{ formData.mobileCodeText }}</button>
					</view>
					<view class="color-tip font-size-goods-tag set-pass-tips">点击“获取动态码”，将会向您已绑定的手机号{{ memberInfoformData.mobile | mobile }}发送验证码</view>
				</block>
				<view class="edit-info-box">
					<text class="info-name">{{ $lang('newPassword') }}</text>
					<input class="uni-input info-content input-len" type="password" maxlength="30" :placeholder="$lang('newPassword')" v-model="formData.newPassword" />
				</view>
				<view class="edit-info-box">
					<text class="info-name">{{ $lang('confirmPassword') }}</text>
					<input class="uni-input info-content input-len" type="password" maxlength="30" :placeholder="$lang('confirmPassword')" v-model="formData.confirmPassword" />
				</view>

				<view class="save-item" @click="save('password')">
					<button type="primary">{{ $lang('save') }}</button>
				</view>
			</block>
		</view>
		<!-- 修改手机号 -->
		<view v-if="indent == 'mobile'" class="edit-info">
			<view class="edit-info-box">
				<text class="info-name">{{ $lang('phoneNumber') }}</text>
				<input class="uni-input info-content" type="number" maxlength="11" :placeholder="$lang('phoneNumber')" v-model="formData.mobile" />
			</view>
			<view class="edit-info-box">
				<text class="info-name">{{ $lang('confirmCode') }}</text>
				<input class="uni-input info-content" type="number" maxlength="4" :placeholder="$lang('confirmCode')" v-model="formData.mobileVercode" />
				<image :src="captcha.img" class="captcha" @click="getCaptcha"></image>
			</view>
			<view class="edit-info-box">
				<text class="info-name">{{ $lang('animateCode') }}</text>
				<input class="uni-input info-content" type="number" maxlength="6" :placeholder="$lang('animateCode')" v-model="formData.mobileDynacode" />
				<button type="primary" class="dynacode" @click="bindMoblieCode()">{{ formData.mobileCodeText }}</button>
			</view>
			<view class="save-item" @click="save('mobile')">
				<button type="primary">{{ $lang('save') }}</button>
			</view>
		</view>
		<view v-if="indent == 'address'" class="edit-info">
			<view class="edit-info-box">
				<text class="info-name">所在地区</text>
				<pick-regions :default-regions="defaultRegions" select-arr="3" @getRegions="handleGetRegions">
					<text class="select-address " :class="{'color-tip': !formData.fullAddress }">
						{{ formData.fullAddress ? formData.fullAddress : '请选择省市区县' }}
					</text>
				</pick-regions>
			</view>
			<view class="edit-info-box">
				<text class="info-name">详细地址</text>
				<input class="uni-input info-content" type="text" placeholder="详细地址" v-model="formData.address" />
			</view>
			<view class="save-item" @click="save('address')">
				<button type="primary">{{ $lang('save') }}</button>
			</view>
		</view>
		<ns-login ref="login"></ns-login>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
import info from './public/js/info.js';

export default {
	components: {
		uniNavBar
	},
	data() {
		return {};
	},
	onload(data) {
		if (data.type) this.indent = data.type;
	},
	mixins: [info],
	filters: {
		mobile(mobile) {
			return mobile.substring(0, 4 - 1) + '****' + mobile.substring(6 + 1);
		}
	}
};
</script>

<style lang="scss">
.info-head {
	.head-nav {
		width: 100%;
		height: var(--status-bar-height);
		background: #ffffff;
	}

	.head-nav.active {
		padding-top: 40rpx;
	}
}

.captcha {
	width: 170rpx;
	height: 50rpx;
}

.info-list-cell {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 24rpx 30rpx;
	position: relative;
	line-height: 50rpx;
	background-color: #fff;

	&:first-child {
		padding: 28rpx 30rpx;
	}

	.cell-tip1 {
		margin-right: 40rpx;
	}

	&.log-out-btn {
		margin-top: 40rpx;

		.cell-tit {
			margin: auto;
		}
	}

	.info-list-head {
		border: 1rpx solid $color-line;
		width: 82rpx;
		height: 82rpx;
		border-radius: 50%;
	}

	.info-list-head image {
		max-width: 100%;
		max-height: 100%;
	}

	// #ifdef MP
	&.info-item {
		margin-top: 16rpx;
	}
	// #endif

	&.info-list-con ~ &.info-list-con:after {
		content: '';
		position: absolute;
		left: 30rpx;
		right: 30rpx;
		top: 0;
		border-bottom: 1rpx solid $color-line;
	}

	.cell-tip {
		margin-left: auto;
		color: $color-tip;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		max-width: 470rpx;
	}

	.cell-more {
		margin-left: 10rpx;
		width: 32rpx;
		height: 100%;
	}

	.cell-more:after {
		content: '';
		display: block;
		width: 12rpx;
		height: 12rpx;
		border: 2rpx solid darken($color-line, 20%) {
			right-color: transparent;
			bottom-color: transparent;
		}

		transform: rotate(135deg);
	}
}

.edit-info-box {
	margin-top: 20rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 40rpx;
	min-height: 50rpx;
	background-color: #fff;

	.info-name {
		width: 150rpx;
		font-size: $font-size-base;
		text-align: left;
	}

	.info-content {
		flex: 1;
		width: 0;
		font-size: $font-size-base;
		padding: 0;
	}

	.dynacode {
		margin: 0;
		padding: 0 10rpx;
		width: 250rpx;
		height: 60rpx;
		font-size: $font-size-base;
		line-height: 60rpx;
		word-break: break-all;
	}
	.edit-sex-list {
		display: flex;
		label {
			display: flex;
			margin-left: 30rpx;
			align-items: center;
		}
	}
	uni-radio .uni-radio-input {
		width: 32rpx;
		height: 32rpx;
	}
	
	.pick-regions {
		flex: 1;
	}
}

.set-pass-tips {
	padding: 20rpx 20rpx 0 20rpx;
}

.input-len {
	width: 500rpx !important;
}

.save-item {
	margin-top: 50rpx;

	button {
		font-size: 30rpx;
	}
}

.empty {
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: $padding;
	box-sizing: border-box;
	justify-content: center;
	padding-top: 80rpx;
	.empty_img {
		width: 63%;
		height: 450rpx;

		image {
			width: 100%;
			height: 100%;
		}
	}
	.iconfont {
		font-size: 190rpx;
		color: $color-tip;
		line-height: 1.2;
	}

	button {
		min-width: 300rpx;
		margin-top: 100rpx;
		height: 70rpx;
		line-height: 70rpx;
		font-size: $font-size-base;
	}
}
</style>
