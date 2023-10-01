declare namespace RPCTypes {
    export type Snowflake = string;
}

declare namespace RPCReq {
    //export type RPCData
    export interface AuthorizeArgs {
        client_id: string;
        scopes: Array<string>;
    }
    export type RPCArgs = AuthorizeArgs;
    export interface Base {
        cmd: string;
        nonce: string;
        evt?: string;
        //data?: RPCData;
        args?: RPCArgs;
    }
    export interface Handshake {
        v: number;
        client_id: string;
    }
}
declare type RPCReq = RPCReq.Base | RPCReq.Handshake;

declare namespace RPCRes {
    export interface User {
        id: RPCTypes.Snowflake;
        username: string;
        discriminator: string;
        global_name?: string;
        avatar?: string;
        bot?: boolean;
        system?: boolean;
        mfa_enabled?: boolean;
        banner?: string;
        accent_color?: number;
        locale?: string;
        verified?: boolean;
        email?: string;
        flags?: string;
        premium_type?: string;
        public_flags?: string;
        avatar_decoration?: string;
    }
    export interface Member {
        user?: User;
        nick?: string;
        avatar?: string;
        roles: Array<RPCTypes.Snowflake>;
        joined_at: string;
        premium_since?: string;
        deaf: boolean;
        mute: boolean;
        flags: number;
        pending?: boolean;
        permissions?: string;
        communication_disabled_until?: string;
    }
    export interface RoleTags {
        bot_id?: RPCTypes.Snowflake;
        integration_id?: RPCTypes.Snowflake;
        premium_subscriber?: null;
        subscription_listing_id?: RPCTypes.Snowflake;
        available_for_purchase?: null;
        guild_connections?: null;
    }
    export interface Role {
        id: RPCTypes.Snowflake;
        name: string;
        color: number;
        hoist: boolean;
        icon?: string;
        unicode_emoji?: string;
        position: number;
        permissions: string;
        managed: boolean;
        mentionable: boolean;
        tags?: RoleTags;
        flags: number;
    }
    export interface Overwrite {
        id: RPCTypes.Snowflake;
        type: number;
        allow: string;
        deny: string;
    }
    export interface ThreadMetadata {
        archived: boolean;
        auto_archive_duration: number;
        archive_timestamp: string;
        locked: boolean;
        invitable?: boolean;
        create_timestamp?: string;
    }
    export interface ThreadMember {
        id?: RPCTypes.Snowflake;
        user_id?: RPCTypes.Snowflake;
        join_timestamp?: string;
        flags: number;
        member?: Member;
    }
    export interface Tag {
        id: RPCTypes.Snowflake;
        name: string;
        moderated: boolean;
        emoji_id: RPCTypes.Snowflake;
        emoji_name: string;
    }
    export interface Reaction {
        emoji_id: RPCTypes.Snowflake;
        emoji_name: string;
    }
    export interface Channel {
        id: RPCTypes.Snowflake;
        type: number;
        guild_id?: RPCTypes.Snowflake;
        position?: number;
        permission_overwrites?: Array<Overwrite>;
        name?: string;
        topic?: string;
        nsfw?: boolean;
        last_message_id?: RPCTypes.Snowflake;
        bitrate?: number;
        user_limit?: number;
        rate_limit_per_user?: number;
        recipients?: Array<User>;
        icon?: string;
        owner_id?: RPCTypes.Snowflake;
        application_id?: RPCTypes.Snowflake;
        managed?: boolean;
        parent_id?: RPCTypes.Snowflake;
        last_pin_timestamp?: string;
        rtc_region?: string;
        video_quality_mode?: number;
        message_count?: number;
        thread_metadata?: ThreadMetadata;
        member?: ThreadMember;
        default_auto_archive_duration?: number;
        permissions?: string;
        flags?: number;
        total_message_sent?: number;
        available_tags?: Array<Tag>;
        applied_tags?: Array<RPCTypes.Snowflake>;
        default_reaction_emoji?: Reaction;
        default_thread_rate_limit_per_user?: number;
        default_sort_order?: number;
        default_forum_layout?: number;
    }
    export interface ChannelMention {
        id: RPCTypes.Snowflake;
        guild_id: RPCTypes.Snowflake;
        type: number;
        name: string;
    }
    export interface Embed {
        title?: string;
        type?: string;
        description?: string;
        url?: string;
        timestamp?: string;
        color?: number;
        footer?: EmbedFooter;
        image?: EmbedImage;
        thumbnail?: EmbedThumbnail;
        video?: EmbedVideo;
        provider?: EmbedProvider;
        author?: EmbedAuthor;
        fields?: Array<EmbedField>;
    }
    // TODO: Not be lazy
    export interface EmbedFooter {};
    export interface EmbedImage {};
    export interface EmbedThumbnail {};
    export interface EmbedVideo {};
    export interface EmbedProvider {};
    export interface EmbedAuthor {};
    export interface EmbedField {};
    export interface MessageActivity {
        type: number;
        party_id?: string;
    }
    export interface Application {};
    export interface Message {
        id: RPCTypes.Snowflake;
        channel_id: RPCTypes.Snowflake;
        author: User;
        content: string;
        timestamp: string;
        edited_timestamp?: string;
        tts: boolean;
        mention_everyone: boolean;
        mentions?: Array<User>;
        mention_roles: Array<Role>;
        mention_channels?: Array<ChannelMention>;
        attachments: Array<Attachment>;
        embeds: Array<Embed>;
        reactions?: Array<Reaction>;
        nonce?: string | number;
        pinned: boolean;
        webhook_id?: RPCTypes.Snowflake;
        type: number;
        activity?: MessageActivity;
        application?: Application;
        application_id?: RPCTypes.Snowflake;
        //theres more but this is rly boring
        // https://discord.com/developers/docs/resources/channel#message-object
    }
    export interface Attachment {
        id: RPCTypes.Snowflake;
        filename: string;
        description?: string;
        content_type?: string;
        size: number;
        url: string;
        proxy_url: string;
        height?: number;
        width?: number;
        ephemeral?: boolean;
        duration_secs?: number;
        waveform?: string;
        flags?: number;
    };
    export interface ApplicationCommandInteractionDataOption {
        name: string;
        type: number;
        value?: string | number | boolean;
        options?: Array<ApplicationCommandInteractionDataOption>;
        focused?: boolean;
    }
    export interface Entitlement {};
    export interface Base {
        id: RPCTypes.Snowflake;
        application_id: RPCTypes.Snowflake;
        type: number;
        data?: {
            id: RPCTypes.Snowflake;
            name: string;
            type: number;
            resolved?: {
                users?: {
                    [key: RPCTypes.Snowflake]: User;
                }
                members?: {
                    [key: RPCTypes.Snowflake]: Member;
                }
                roles?: {
                    [key: RPCTypes.Snowflake]: Role;
                }
                channels?: {
                    [key: RPCTypes.Snowflake]: Channel;
                }
                messages?: {
                    [key: RPCTypes.Snowflake]: Message;
                }
                attachments: {
                    [key: RPCTypes.Snowflake]: Attachment;
                }
            }
            options?: Array<ApplicationCommandInteractionDataOptions>;
            guild_id?: RPCTypes.Snowflake;
            target_id?: RPCTypes.Snowflake;
        }
        guild_id?: RPCTypes.Snowflake;
        channel?: Channel;
        channel_id?: RPCTypes.Snowflake;
        member?: Member;
        user?: User;
        token: string;
        version: number;
        message?: Message;
        app_permissions?: string;
        locale?: string;
        guild_locale?: string;
        entitlements?: Array<Entitlement>;
    }
    export interface Decoded {
        op?: number;
        data: Base;
    }
}
declare type RPCRes = RPCRes.Decoded;

declare interface Working {
    full: string;
    op?: number;
}
