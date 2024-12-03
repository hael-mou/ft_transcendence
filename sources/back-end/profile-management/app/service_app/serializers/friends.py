from rest_framework import serializers
from ..models import FriendShipRequest, Profile
from ..serializers.profile import ProfileSerializer


class FriendShipSerializer(serializers.Serializer):
    receiver_id = serializers.IntegerField(write_only=True, required=True)
    sender_profile = ProfileSerializer(read_only=True)
    receiver_profile = ProfileSerializer(read_only=True)

    class Meta:
        model = FriendShipRequest
        fields = ['receiver_id', 'sender_profile', 'receiver_profile', 'status']


    def validate(self, data):
        receiver_id = data['receiver_id']
        sender_id = self.context['request'].user.id
        sender_profile = Profile.objects.filter(id=sender_id).first()
        receiver_profile = Profile.objects.filter(id=receiver_id).first()

        if not sender_profile or not receiver_profile:
            raise serializers.ValidationError({"error": "One or both users do not exist"})

        if sender_id == receiver_id:
            raise serializers.ValidationError({"error": "You can't add yourself as a friend"})

        elif receiver_profile.friends.filter(id=sender_id).exists():
            raise serializers.ValidationError({"error":"You are already friends with this user"})

        elif self.Meta.model.objects.filter(sender_profile=sender_profile, receiver_profile=receiver_profile).exists():
            raise serializers.ValidationError({"error":"You already sent a friend request to this user"})

        elif self.Meta.model.objects.filter(receiver_profile=sender_profile , sender_profile=receiver_profile).exists():
            raise serializers.ValidationError({"error":"This user already sent a friend request to you"})

        return {'sender_profile': sender_profile, 'receiver_profile': receiver_profile}

    def create(self, validated_data):
        return self.Meta.model.objects.create(
            sender_profile=validated_data['sender_profile'],
            receiver_profile=validated_data['receiver_profile']
        )




class AcceptFriendSerializer(serializers.Serializer):
    receiver_id = serializers.IntegerField(read_only=True)
    sender_id = serializers.IntegerField(write_only=True, required=True)

    class Meta:
        model = FriendShipRequest
        fields = ['receiver_id', 'sender_id']

    def validate(self, data):
        sender_id = data['sender_id']
        print("sender_id", sender_id)
        receiver_id = self.context['request'].user.id
        print("receiver_id", receiver_id)
        sender_profile = Profile.objects.filter(id=sender_id).first()
        print("sender_profile", sender_profile)
        receiver_profile = Profile.objects.filter(id=receiver_id).first()
        print("receiver_profile", receiver_profile)
        friend_request = self.Meta.model.objects.filter(sender_profile=sender_profile,
                                                        receiver_profile=receiver_profile).first()
        if not friend_request:
            raise serializers.ValidationError({"error": "No friend request found"})

        if not sender_profile or not receiver_profile:
            raise serializers.ValidationError({"error": "One or both users do not exist"})

        if sender_id == receiver_id:
            raise serializers.ValidationError({"error":"You can't accept yourself as a friend"})

        elif sender_profile.friends.filter(id=receiver_id).exists():
            raise serializers.ValidationError({"error":"You are already friends with this user"})

        return {'sender_profile': sender_profile, 'receiver_profile': receiver_profile, 'friend_request': friend_request}

    def create(self, validated_data):
        validated_data['friend_request'].delete()
        validated_data['sender_profile'].add_friend(validated_data["receiver_profile"])
        return (validated_data['sender_profile'], validated_data['receiver_profile'])

class RejectSerializer(serializers.Serializer):
    receiver_id = serializers.IntegerField(read_only=True)
    sender_id = serializers.IntegerField(write_only=True, required=True)

    class Meta:
        model = FriendShipRequest
        fields = ['receiver_id', 'sender_id']

    def validate(self, data):
        sender_id = data['sender_id']
        receiver_id = self.context['request'].user.id
        sender_profile = Profile.objects.filter(id=sender_id).first()
        receiver_profile = Profile.objects.filter(id=receiver_id).first()
        friend_request = self.Meta.model.objects.filter(sender_profile=sender_profile,
                                                        receiver_profile=receiver_profile).first()

        if not friend_request:
            raise serializers.ValidationError({"error": "No friend request found"})

        if not sender_profile or not receiver_profile:
            raise serializers.ValidationError({"error": "One or both users do not exist"})

        if sender_id == receiver_id:
            raise serializers.ValidationError({"error":"You can't reject yourself as a friend"})
        return friend_request

class CancelSerializer(serializers.Serializer):
    sender_id = serializers.IntegerField(read_only=True)
    receiver_id = serializers.IntegerField(write_only=True, required=True)

    class Meta:
        model = FriendShipRequest
        fields = ['receiver_id', 'sender_id']

    def validate(self, data):
        receiver_id = data['receiver_id']
        sender_id = self.context['request'].user.id
        receiver_profile = Profile.objects.filter(id=receiver_id).first()
        sender_profile = Profile.objects.filter(id=sender_id).first()
        friend_request = self.Meta.model.objects.filter(receiver_profile=receiver_profile,
                                                        sender_profile=sender_profile).first()

        if not friend_request:
            raise serializers.ValidationError("No friend request found")

        if not sender_profile or not receiver_profile:
            raise serializers.ValidationError("One or both users do not exist")

        if sender_id == receiver_id:
            raise serializers.ValidationError("You can't reject yourself as a friend")

        return friend_request


class RemoveFriendSerializer(serializers.Serializer):
    friend_id = serializers.IntegerField(write_only=True, required=True)

    class Meta:
        model = Profile.friends
        fields = ['friend_id']

    def validate(self, attrs):
        friend_id = attrs['friend_id']
        user = self.context['request'].user
        user_profile = Profile.objects.filter(id=user.id).first()
        if user_profile is None:
            raise serializers.ValidationError({"error":"User not found"})
        if friend_id == user.id:
            raise serializers.ValidationError({"error":"You can't remove yourself as a friend"})
        if friend_id not in Profile.objects.values_list('id', flat=True):
            raise serializers.ValidationError({"error":"Friend not found"})
        return {'user': user_profile, 'friend': friend_id}
